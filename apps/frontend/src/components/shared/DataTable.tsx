
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import { getRankImage } from "../../helpers/rankoverlay";
import Image from "next/image";
import axios from "axios";

interface TableDemoProps {
  users: any[]
}

const apiURL = process.env.NEXT_PUBLIC_BACKEND;
const api = axios.create({
  baseURL: apiURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

function banUser(userId: string) {
  api.post('/users/ban/' + userId)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });

  window.location.reload();
}

function deleteUser(userId: string) {
  api.post('/users/delete/' + userId)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });

  window.location.reload();
}

function demoteUser(userId: string) {
  api.post('/users/demote/' + userId)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  window.location.reload();
}

function promoteUser(userId: string) {
  api.post('/users/promote/' + userId)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  window.location.reload();
}

export function TableDemo({ users }: TableDemoProps) {
  return (
    <Table className="bg-white rounded-md drop-shadow shadow-black">
      <TableCaption>A list of players</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Player ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="">Tag</TableHead>
          <TableHead className="">Rank</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users ? users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.id}</TableCell>
            <TableCell>{user.isBanned ? "BANNED" : user.role}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.valorant.id !== '' ? (user.valorant.username + '#' + user.valorant.tag) : 'Not Found'}</TableCell>
            <TableCell className=""><Image width={40} height={40} src={getRankImage(user.valorant.rank || 'Iron 1')} alt={user.valorant.rank || 'Iron 1'} /></TableCell>
            <TableCell className="flex gap-2 text-right justify-end"> 
              <Button onClick={() => {banUser(user.id)}}>{user.isBanned ? 'Unban' : 'Ban'}</Button> 
              <Button onClick={() => {deleteUser(user.id)}}>Delete</Button> 
              {user.role == "ADMIN" && <Button onClick={() => {demoteUser(user.id)}}>Demote</Button>}
              {user.role == "USER" && <Button onClick={() => {promoteUser(user.id)}}>Promote</Button>}
              {user.role == "MANAGER" && <><Button onClick={() => {demoteUser(user.id)}} >Demote</Button> <Button onClick={() => {promoteUser(user.id)}}>Promote</Button></>}
            </TableCell>
          </TableRow>
        )) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center">
              No users found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
