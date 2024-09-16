import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Flex,
  LoadingOverlay,
  Pagination,
  Select,
  Table,
  Text,
  TextInput
} from "@mantine/core";
import debounce from "lodash/debounce";
import capitalize from "lodash/capitalize";
import { userTable } from "./styles.module.css";
import { type GetAllUsersResult } from "@/types/results";
import { type User } from "@/types/user";
import { Sort } from "@/pages/Home.page";

interface UserListProps extends NonNullable<GetAllUsersResult["data"]> {
  loading: boolean;
  count: number;
  onCreate: () => void;
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  onPageSelect: (pageSize: string) => void;
  onItemClick: (user: User) => void;
  onHeaderClick: (sort: Sort) => void;
}

const UserList = ({
  users,
  pageCount,
  loading,
  count,
  onCreate,
  onItemClick,
  onPageChange,
  onPageSelect,
  onSearch,
  onHeaderClick
}: UserListProps) => {
  const debouncedSearch = useMemo(() => debounce(onSearch, 300), [onSearch]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [sort, setSort] = useState<{ key: keyof User; order: "asc" | "desc" }>({
    key: "id",
    order: "asc"
  });

  // only show loading overlay if loading prop stays true for more than 300ms
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (loading) {
      timeout = setTimeout(() => {
        setInternalLoading(loading);
      }, 300);
    } else {
      setInternalLoading(loading);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [loading]);

  const handleHeaderClick = (key: keyof User) => {
    const obj = {
      key,
      order: (sort.key === key && sort.order === "asc" ? "desc" : "asc") as
        | "asc"
        | "desc"
    };
    setSort(obj);
    onHeaderClick(obj);
  };

  return (
    <>
      <Flex gap="sm" justify="space-between">
        <Flex gap="sm" align="center">
          <TextInput
            mt="lg"
            w="240px"
            placeholder="Search"
            onChange={event => {
              debouncedSearch(event.currentTarget.value);
            }}
          />
          <Text c="gray" mt="lg">
            {count} users
          </Text>
        </Flex>
        <Button variant="light" onClick={() => onCreate()} mt="lg">
          Create User
        </Button>
      </Flex>
      <Flex
        direction="column"
        justify="space-between"
        mah="calc(100vh - 144px)"
        gap="lg"
        style={{
          flexGrow: 1
        }}
      >
        <div className={userTable}>
          <Table
            highlightOnHover
            highlightOnHoverColor="usersdotOrange.0"
            stickyHeader
          >
            <Table.Thead>
              <Table.Tr>
                {Object.keys(users[0] ?? {}).map(key => (
                  <Table.Th
                    key={key}
                    onClick={() => handleHeaderClick(key as keyof User)}
                    style={{
                      cursor: "pointer"
                    }}
                  >
                    {capitalize(key.split(/(?=[A-Z])/).join(" "))}
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        visibility: sort.key !== key ? "hidden" : "visible"
                      }}
                    >
                      {sort.order === "asc" ? "↑" : "↓"}
                    </span>
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {users?.map((user: User) => (
                <Table.Tr
                  key={user.id}
                  style={{
                    cursor: "pointer"
                  }}
                  onClick={() => onItemClick(user)}
                >
                  <Table.Td>{user.id}</Table.Td>
                  <Table.Td>{user.name}</Table.Td>
                  <Table.Td>{user.surname}</Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>{user.age}</Table.Td>
                  <Table.Td>{user.country}</Table.Td>
                  <Table.Td>{user.district}</Table.Td>
                  <Table.Td>{user.role}</Table.Td>
                  <Table.Td>
                    {new Date(user.createdAt).toLocaleString()}
                  </Table.Td>
                  <Table.Td>
                    {new Date(user.updatedAt).toLocaleString()}
                  </Table.Td>
                </Table.Tr>
              ))}
              {users?.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={9} align="center">
                    No users found
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </div>
        <Flex justify="end" align="center">
          <div
            style={{
              position: "relative"
            }}
          >
            <LoadingOverlay
              visible={internalLoading}
              loaderProps={{
                size: "sm"
              }}
            />
            <Pagination
              total={pageCount ?? 0}
              defaultValue={1}
              withEdges
              onChange={onPageChange}
            />
          </div>
          <Select
            data={["10", "20", "30", "40", "50"]}
            defaultValue="10"
            w="70px"
            allowDeselect={false}
            checkIconPosition="right"
            onChange={value => onPageSelect(value ?? "")}
            style={{ marginLeft: "1rem" }}
          />
        </Flex>
      </Flex>
    </>
  );
};

export default UserList;
