import { UserWithOldPassword } from "@/types/user";

const validateUserForm = (user: UserWithOldPassword) => {
  const errors: { [key in keyof UserWithOldPassword]?: string } = {};

  if (!user.name) {
    errors.name = "Name is required";
  }

  if (!user.surname) {
    errors.surname = "Surname is required";
  }

  if (!user.email) {
    errors.email = "Email is required";
  }

  if (/^\S+@\S+\.\S+$/.test(user.email) === false) {
    errors.email = "Email is invalid";
  }

  if (!user.age) {
    errors.age = "Age is required";
  }

  if (!user.country) {
    errors.country = "Country is required";
  }

  if (!user.district) {
    errors.district = "District is required";
  }

  if (!user.role) {
    errors.role = "Role is required";
  }

  if (user.id !== -1 && user.password && !user.oldPassword) {
    errors.oldPassword = "Old password is required to change the password";
  }

  return errors;
};

export default validateUserForm;
