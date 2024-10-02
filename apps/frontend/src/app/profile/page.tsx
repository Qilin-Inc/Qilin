import { getUsers } from '../api/users/get-users'; // Adjust the import path as necessary
import { UserButton } from "@clerk/nextjs";
import { currentUser, auth } from "@clerk/nextjs/server";

export default async function Home() {
    // const authDetails = auth();
    // console.log('Auth Details:', authDetails);
  
    const user = await currentUser();
    // console.log('Current User:', user);
  
    const response = await getUsers(); // Fetch users
    const allUsers = response.data || []; // just accessing the data object from the all users object of array second object in the array is timestamp
    console.log('Fetched users:', allUsers); // Log the fetched users

    return (
     <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <UserButton />
      {user?.firstName} {user?.lastName}
      <div>
        <h1>All users</h1>
        <ol>
          {Array.isArray(allUsers) && allUsers.length > 0 ? ( // Check if allUsers is an array and has elements
            allUsers.map((user: any) => (
              <li key={user.id}>
                <div>
                  <strong>Username:</strong> {user.username} <br />
                  <strong>Name:</strong> {user.firstName} {user.lastName} <br />
                  <strong>Email:</strong> {user.emailAddresses.length > 0 ? user.emailAddresses[0].email : 'No email'} <br />
                  <strong>Phone:</strong> {user.phoneNumbers.length > 0 ? user.phoneNumbers[0].number : 'No phone number'} <br />
                </div>
              </li>
            ))
          ) : (
            <li>No users found.</li> // Fallback message if no users are available
          )}
        </ol>
      </div>
     </div>
    );
  }

