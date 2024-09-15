import { useEffect, useState } from "react";
import {
  Modal,
  TextInput,
  Button,
  NumberInput,
  Select,
  Flex
} from "@mantine/core";
import { type User } from "@/types/user";

type UserWithOldPassword = User & { oldPassword: string };

interface UserEditModalProps {
  opened: boolean;
  user: User;
  loading: boolean;
  onClose: () => void;
  onSave: (user: UserWithOldPassword) => void;
}

const handleValidation = (user: UserWithOldPassword) => {
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

const UserEditModal = ({
  opened,
  user,
  loading,
  onClose,
  onSave
}: UserEditModalProps) => {
  const [internalUser, setInternalUser] = useState<UserWithOldPassword>({
    ...user,
    oldPassword: ""
  });

  const [error, setError] = useState<{
    [key in keyof UserWithOldPassword]?: string;
  }>({});

  useEffect(() => {
    setInternalUser({ ...user, oldPassword: "" });
    setError({});
  }, [user]);

  return (
    <Modal
      opened={opened}
      title={<h2>Edit {user.name}</h2>}
      onClose={onClose}
      size="xs"
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem"
        }
      }}
    >
      <Flex gap="8px">
        <TextInput
          label="Name"
          value={internalUser.name ?? ""}
          onChange={event => {
            setInternalUser(prev => ({
              ...prev,
              name: event.target.value ?? ""
            }));

            setError(prev => ({ ...prev, name: "" }));
          }}
          error={error.name}
        />
        <TextInput
          label="Surname"
          value={internalUser.surname ?? ""}
          onChange={event => {
            setInternalUser(prev => ({
              ...prev,
              surname: event.target.value ?? ""
            }));

            setError(prev => ({ ...prev, surname: "" }));
          }}
          error={error.surname}
        />
      </Flex>

      <TextInput
        label="Email"
        value={internalUser.email ?? ""}
        onChange={event => {
          setInternalUser(prev => ({
            ...prev,
            email: event.target.value ?? ""
          }));

          setError(prev => ({ ...prev, email: "" }));
        }}
        error={error.email}
      />

      <NumberInput
        label="Age"
        value={internalUser.age ?? ""}
        min={0}
        onChange={value => {
          setInternalUser(prev => ({
            ...prev,
            age: (value as number) ?? 0
          }));

          setError(prev => ({ ...prev, age: "" }));
        }}
        error={error.age}
      />
      <Flex gap="8px">
        <TextInput
          label="Country"
          value={internalUser.country ?? ""}
          onChange={event => {
            setInternalUser(prev => ({
              ...prev,
              country: event.target.value ?? ""
            }));

            setError(prev => ({ ...prev, country: "" }));
          }}
          error={error.country}
        />

        <TextInput
          label="District"
          value={internalUser.district ?? ""}
          onChange={event => {
            setInternalUser(prev => ({
              ...prev,
              district: event.target.value ?? ""
            }));

            setError(prev => ({ ...prev, district: "" }));
          }}
          error={error.district}
        />
      </Flex>

      <Select
        label="Role"
        data={[
          { label: "User", value: "user" },
          { label: "Admin", value: "admin" }
        ]}
        value={internalUser.role ?? ""}
        checkIconPosition="right"
        allowDeselect={false}
        onChange={value => {
          setInternalUser(prev => ({
            ...prev,
            role: (value as "user" | "admin") ?? "user"
          }));

          setError(prev => ({ ...prev, role: "" }));
        }}
        error={error.role}
      />
      <Flex gap="8px">
        {user.id !== -1 && (
          <TextInput
            label="Old Password"
            value={internalUser.oldPassword ?? ""}
            onChange={event => {
              setInternalUser(prev => ({
                ...prev,
                oldPassword: event.target.value ?? ""
              }));

              setError(prev => ({ ...prev, oldPassword: "" }));
            }}
            error={error.oldPassword}
          />
        )}

        <TextInput
          label={user.id === -1 ? "Password" : "New Password"}
          w={user.id === -1 ? "100%" : "calc(50% - 4px)"}
          value={internalUser.password ?? ""}
          onChange={event => {
            setInternalUser(prev => ({
              ...prev,
              password: event.target.value ?? ""
            }));

            setError(prev => ({ ...prev, password: "" }));
          }}
          error={error.password}
        />
      </Flex>
      <Button
        loading={loading}
        onClick={() => {
          const errors = handleValidation(internalUser);
          setError(errors);
          if (Object.keys(errors).length > 0) {
            return;
          }
          onSave(internalUser);
        }}
      >
        Save
      </Button>
    </Modal>
  );
};

export default UserEditModal;
