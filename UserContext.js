import { createContext } from "react";

const UserContext = createContext({
	username: "",
	role: "",
});

export default UserContext;
