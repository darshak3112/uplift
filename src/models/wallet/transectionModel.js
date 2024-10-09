import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    from: {
      userType: {
        type: String,
        enum: ["Tester", "Creator", "Admin"], // Specify the type of user
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "from.userType", // Dynamic reference
      },
    },
    to: {
      userType: {
        type: String,
        enum: ["Tester", "Creator", "Admin"],
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "to.userType", // Dynamic reference
      },
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
export default Transaction;
