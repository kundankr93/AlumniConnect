import Connection from "../models/Connection.js";
import User from "../models/User.js";

export const sendConnectionRequest = async (
  req,
  res
) => {
  try {
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }

    if (
      receiverId === req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot send a connection request to yourself",
      });
    }

    const receiver = await User.findById(
      receiverId
    );

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    const existingConnection =
      await Connection.findOne({
        $or: [
          {
            sender: req.user._id,
            receiver: receiverId,
          },
          {
            sender: receiverId,
            receiver: req.user._id,
          },
        ],
      });

    if (existingConnection) {
      return res.status(400).json({
        success: false,
        message:
          "A connection request already exists between these users",
      });
    }

    const connection =
      await Connection.create({
        sender: req.user._id,
        receiver: receiverId,
      });

    await connection.populate(
      "sender receiver",
      "name email role profileImage"
    );

    return res.status(201).json({
      success: true,
      message:
        "Connection request sent successfully",
      connection,
    });
  } catch (error) {
    console.error(
      `Send connection request error: ${error.message}`
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid receiver ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while sending connection request",
    });
  }
};

export const getReceivedRequests = async (
  req,
  res
) => {
  try {
    const requests = await Connection.find({
      receiver: req.user._id,
      status: "pending",
    })
      .populate(
        "sender",
        "name email role branch graduationYear profileImage"
      )
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      `Get received requests error: ${error.message}`
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching received connection requests",
    });
  }
};

export const respondToConnectionRequest =
  async (req, res) => {
    try {
      const { status } = req.body;

      if (
        !["accepted", "rejected"].includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Status must be accepted or rejected",
        });
      }

      const connection =
        await Connection.findById(
          req.params.id
        );

      if (!connection) {
        return res.status(404).json({
          success: false,
          message:
            "Connection request not found",
        });
      }

      if (
        connection.receiver.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            "Only the receiver can respond to this request",
        });
      }

      if (connection.status !== "pending") {
        return res.status(400).json({
          success: false,
          message:
            "This connection request has already been processed",
        });
      }

      connection.status = status;

      await connection.save();

      await connection.populate(
        "sender receiver",
        "name email role profileImage"
      );

      return res.status(200).json({
        success: true,
        message:
          status === "accepted"
            ? "Connection request accepted successfully"
            : "Connection request rejected successfully",
        connection,
      });
    } catch (error) {
      console.error(
        `Respond to connection request error: ${error.message}`
      );

      if (error.name === "CastError") {
        return res.status(400).json({
          success: false,
          message:
            "Invalid connection request ID",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Server error while responding to connection request",
      });
    }
  };

  export const getMyConnections = async (
  req,
  res
) => {
  try {
    const connections =
      await Connection.find({
        status: "accepted",
        $or: [
          {
            sender: req.user._id,
          },
          {
            receiver: req.user._id,
          },
        ],
      })
        .populate(
          "sender",
          "name email role branch graduationYear profileImage"
        )
        .populate(
          "receiver",
          "name email role branch graduationYear profileImage"
        )
        .sort({
          updatedAt: -1,
        });

    const users = connections.map(
      (connection) => {
        const isSender =
          connection.sender._id.toString() ===
          req.user._id.toString();

        const connectedUser = isSender
          ? connection.receiver
          : connection.sender;

        return {
          connectionId: connection._id,
          user: connectedUser,
          connectedAt:
            connection.updatedAt,
        };
      }
    );

    return res.status(200).json({
      success: true,
      count: users.length,
      connections: users,
    });
  } catch (error) {
    console.error(
      `Get my connections error: ${error.message}`
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching connections",
    });
  }
};

export const removeConnection = async (
  req,
  res
) => {
  try {
    const connection =
      await Connection.findById(
        req.params.id
      );

    if (!connection) {
      return res.status(404).json({
        success: false,
        message: "Connection not found",
      });
    }

    const loggedInUserId =
      req.user._id.toString();

    const isSender =
      connection.sender.toString() ===
      loggedInUserId;

    const isReceiver =
      connection.receiver.toString() ===
      loggedInUserId;

    // Only users involved in the connection
    // can remove it
    if (!isSender && !isReceiver) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to remove this connection",
      });
    }

    // Only accepted connections can be removed
    if (connection.status !== "accepted") {
      return res.status(400).json({
        success: false,
        message:
          "Only accepted connections can be removed",
      });
    }

    await connection.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Connection removed successfully",
    });
  } catch (error) {
    console.error(
      `Remove connection error: ${error.message}`
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid connection ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Server error while removing connection",
    });
  }
};