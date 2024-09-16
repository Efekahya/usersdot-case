import { useCallback, useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import UserEditModal from "@/components/UserEditModal";
import UserList from "@/components/UserList";
import { GetAllUsersResult } from "@/types/results";
import { User } from "@/types/user";
import Logo from "@/components/Logo";

export interface Sort {
  key: keyof User;
  order: "asc" | "desc";
}

const initialEditUser: User = {
  id: -1,
  name: "",
  surname: "",
  email: "",
  age: 0,
  country: "",
  district: "",
  role: "user",
  password: "",
  createdAt: "",
  updatedAt: ""
};

const compareUsers = (user1: User, user2: User) =>
  Object.keys(user1).every(key => {
    if (key === "oldPassword") {
      return true;
    }
    return user1[key as keyof User] === user2[key as keyof User];
  });

export function HomePage() {
  const [data, setData] = useState<GetAllUsersResult["data"]>();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState("10");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>({ key: "id", order: "asc" });
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(-1);
  const [modalOpened, setModalOpened] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URI}/users?page=${page}&pageSize=${pageSize}&search=${search}&sort=${sort.key}&order=${sort.order}`
    );
    const data = await response.json();
    setData(data.data);
    setLoading(false);
  }, [page, pageSize, search, sort.key, sort.order]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (user: User) => {
    setLoading(true);

    if (
      compareUsers(
        user,
        data?.users.find(u => u.id === user.id) ?? initialEditUser
      )
    ) {
      setModalOpened(false);
      setTimeout(() => {
        setSelectedUserId(-1);
      }, 300);
      setLoading(false);
      return;
    }

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URI}/users/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...user, id: user.id })
      }
    );
    const res = await response.json();

    if (!res.success) {
      setLoading(false);
      notifications.show({
        title: "Error",
        message: res.error,
        color: "red"
      });
      return;
    }

    setData(prev => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        users: prev.users.map(u =>
          u.id === user.id ? { ...user, oldPassword: "", password: "" } : u
        )
      };
    });

    setModalOpened(false);

    setTimeout(() => {
      setSelectedUserId(-1);
    }, 300);

    setLoading(false);
    notifications.show({
      title: "Success",
      message: "User updated successfully",
      color: "green"
    });
  };

  const handleCreate = async (user: User) => {
    setLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URI}/users/save`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      }
    );
    const res = await response.json();

    if (!res.success) {
      setLoading(false);
      notifications.show({
        title: "Error",
        message: res.error,
        color: "red"
      });
      return;
    }
    fetchData();
    setModalOpened(false);
    setTimeout(() => {
      setSelectedUserId(-1);
    }, 300);
    setLoading(false);
    notifications.show({
      title: "Success",
      message: "User created successfully",
      color: "green"
    });
  };

  return (
    <>
      <Logo />
      <UserList
        users={data?.users ?? []}
        pageCount={data?.pageCount ?? 0}
        count={data?.count ?? 0}
        onCreate={() => {
          setSelectedUserId(-1);
          setModalOpened(true);
        }}
        onPageChange={page => setPage(page - 1)}
        onPageSelect={setPageSize}
        onSearch={setSearch}
        onItemClick={user => {
          setSelectedUserId(user.id);
          setModalOpened(true);
        }}
        loading={loading}
        onHeaderClick={setSort}
      />
      <UserEditModal
        opened={modalOpened}
        loading={loading}
        user={
          data?.users.find(user => user.id === selectedUserId) ??
          initialEditUser
        }
        onClose={() => {
          setModalOpened(false);
          setTimeout(() => {
            setSelectedUserId(-1);
          }, 300);
        }}
        onSave={user => {
          if (user.id === -1) {
            handleCreate(user);
            return;
          }
          handleSave(user);
        }}
      />
    </>
  );
}
