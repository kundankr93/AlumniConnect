import AlumniProfile from "../models/AlumniProfile.js";

export const createOrUpdateAlumniProfile = async (
  req,
  res
) => {
  try {
    const {
      company,
      jobTitle,
      branch,
      graduationYear,
      skills,
      location,
      linkedin,
      bio,
      availableForMentorship,
    } = req.body;

    if (
      !company ||
      !jobTitle ||
      !branch ||
      !graduationYear
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Company, job title, branch and graduation year are required",
      });
    }

    let profile = await AlumniProfile.findOne({
      user: req.user._id,
    });

    if (profile) {
      profile.company = company;
      profile.jobTitle = jobTitle;
      profile.branch = branch;
      profile.graduationYear = graduationYear;
      profile.skills = skills || [];
      profile.location = location || "";
      profile.linkedin = linkedin || "";
      profile.bio = bio || "";

      if (
        availableForMentorship !== undefined
      ) {
        profile.availableForMentorship =
          availableForMentorship;
      }

      await profile.save();

      return res.status(200).json({
        success: true,
        message:
          "Alumni profile updated successfully",
        profile,
      });
    }

    profile = await AlumniProfile.create({
      user: req.user._id,
      company,
      jobTitle,
      branch,
      graduationYear,
      skills: skills || [],
      location: location || "",
      linkedin: linkedin || "",
      bio: bio || "",
      availableForMentorship:
        availableForMentorship ?? true,
    });

    return res.status(201).json({
      success: true,
      message:
        "Alumni profile created successfully",
      profile,
    });
  } catch (error) {
    console.error(
      `Alumni profile error: ${error.message}`
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while saving alumni profile",
    });
  }
};

export const getAllAlumni = async (req, res) => {
  try {
    const {
      search,
      company,
      branch,
      skill,
      graduationYear,
      location,
    } = req.query;

    const filter = {};

    if (company) {
      filter.company = {
        $regex: company,
        $options: "i",
      };
    }

    if (branch) {
      filter.branch = {
        $regex: branch,
        $options: "i",
      };
    }

    if (skill) {
      filter.skills = {
        $regex: skill,
        $options: "i",
      };
    }

    if (graduationYear) {
      filter.graduationYear = Number(
        graduationYear
      );
    }

    if (location) {
      filter.location = {
        $regex: location,
        $options: "i",
      };
    }

    let profiles = await AlumniProfile.find(
      filter
    )
      .populate(
        "user",
        "name email profileImage"
      )
      .sort({
        createdAt: -1,
      });

    if (search) {
      const searchText = search.toLowerCase();

      profiles = profiles.filter(
        (profile) =>
          profile.user?.name
            ?.toLowerCase()
            .includes(searchText) ||
          profile.company
            .toLowerCase()
            .includes(searchText) ||
          profile.jobTitle
            .toLowerCase()
            .includes(searchText) ||
          profile.skills.some((item) =>
            item
              .toLowerCase()
              .includes(searchText)
          )
      );
    }

    return res.status(200).json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    console.error(
      `Get alumni error: ${error.message}`
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching alumni profiles",
    });
  }
};

export const getAlumniById = async (req, res) => {
  try {
    const profile = await AlumniProfile.findById(
      req.params.id
    ).populate(
      "user",
      "name email profileImage"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Alumni profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error(
      `Get alumni profile error: ${error.message}`
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid alumni profile ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching alumni profile",
    });
  }
};