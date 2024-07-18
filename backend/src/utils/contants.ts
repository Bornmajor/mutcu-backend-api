// define global contact functions here

// regex to validate a password
export const validateEmail = (email: string) => {
  const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regEx.test(email);
};

export const validateForm = async (
  name: string,
  email: string,
  password: string
) => {
  if (!email?.trim() || !name?.trim() || !password?.trim()) {
    return { error: "Name, Email and password are required!" };
  }

  if (name.length < 3) {
    return { error: "Name must have 3 or more characters" };
  }
  if (!validateEmail(email)) {
    return { error: "Email is invalid" };
  }

  if (password.length < 5) {
    return { error: "Password must have 5 or more characters" };
  }

  return null;
};
