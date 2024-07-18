import { Request, NextFunction, Response } from "express";

// @route   POST /contact_us
// @desc    send an email to MUT CU from contact us form on the UI
// @access  PRIVATE

export async function handleContactUs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Get user based on POSTed email
    const { name, email, phoneNumber, message } = req.body;

    if (!email || !name || !phoneNumber || !message) {
      return res.status(400).json({ message: "Bad request" });
    }
    // send email to mutcu@ac.ke her when a user contacts*******

    // await transporter.sendMail({
    //   ...mailOptions,
    //   ...generateContactUsEmailContent(name, email, phoneNumber, message),
    //   subject: `MUT CU CONTACT US MESSAGE FROM ${name}, ${email}, ${phoneNumber}`,
    // });

    return res.status(200).json({
      message: "Message successfully sent!",
    });
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
  }
}
