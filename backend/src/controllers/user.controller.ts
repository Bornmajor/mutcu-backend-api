import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db";

// @route   PATCH /profile/id
// @desc    PATCH a user
// @access  PRIVATE
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { image, name, location, phoneNumber } = req.body;
  const user = req.user || {};
  const { id } = req.params;

  if (!user || !name) {
    return res.status(400).json({ message: "Missing user or name!" });
  }
  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { image, name, location, phoneNumber },
      select: {},
    });

    if (updatedUser) {
      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } else {
      return res.status(400).json({ message: "User update failed!" });
    }
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
  }
}
 