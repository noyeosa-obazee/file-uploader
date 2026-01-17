import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

const getSignUpForm = (req, res) => {
  res.render("sign-up");
};

const signUp = async (req, res) => {
  try {
    if (req.body.password !== req.body.confirmPassword) {
      return res.redirect("/sign-up");
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    await prisma.user.create({
      data: {
        email: req.body.email,
        username: req.body.username || null,
        password: hashedPassword,
      },
    });

    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
};

export { getSignUpForm, signUp };
