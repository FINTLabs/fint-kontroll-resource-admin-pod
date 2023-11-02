import React, { createContext, useContext, useState, useEffect } from "react"
import { IUserPage, IUser, userContextDefaultValues, IUserListToBeReplaced } from "./types"
import UsersRepository from "../repositories/users-repository"
import { ErrorResponse } from "react-router-dom"

interface UserContextType {
	currentPage: number
	isLoading: boolean
	itemsPerPage: number
	orgUnitIds: string[]
	usersPage: IUserListToBeReplaced | null
	selectedUser: IUser | null
	setCurrentPage: (currentPage: number) => void
	setIsLoading: (isLoading: boolean) => void
	setItemsPerPage: (itemsPerUSer: number) => void
	setSelectedUser: (user: IUser | null) => void
	setOrgUnitIds: (orgUnitIds: string[]) => void
	setUser: (data: IUserPage | null) => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children, basePath }: { children: React.ReactNode; basePath: string }) {
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [itemsPerPage, setItemsPerPage] = useState<number>(5)
	const [orgUnitIds, setOrgUnitIds] = useState<string[]>(userContextDefaultValues.orgUnitIds)
	const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
	const [usersPage, setUsersPage] = useState<IUserListToBeReplaced | null>(null)

	const setUser = (data: IUserListToBeReplaced | null) => {
		setUsersPage(data)
	}

	useEffect(() => {
		const fetchUsersPage = async () => {
			if (basePath) {
				setIsLoading(true)
				await UsersRepository.getUsersPage(basePath, currentPage, itemsPerPage, orgUnitIds)
					.then((response) => {
						setUsersPage(response.data)
					})
					.catch((err: ErrorResponse) => console.error(err))
					.finally(() => setIsLoading(false))
			}
		}

		fetchUsersPage()
	}, [basePath, currentPage, itemsPerPage, orgUnitIds])

	return (
		<UserContext.Provider
			value={{
				currentPage,
				itemsPerPage,
				isLoading,
				orgUnitIds,
				usersPage,
				selectedUser,
				setCurrentPage,
				setIsLoading,
				setUser,
				setSelectedUser,
				setItemsPerPage,
				setOrgUnitIds
			}}
		>
			{children}
		</UserContext.Provider>
	)
}

export function useUser() {
	const context = useContext(UserContext)
	if (!context) {
		throw new Error("useUser must be used within a UserProvider")
	}
	return context
}
