import React, { createContext, useContext, useState, useEffect } from "react"
import { IPermissionData, IRole, roleContextDefaultValues } from "./types"
import RolesRepositories from "../repositories/RolesRepositories"
import { useSafeTabChange } from "./SafeTabChangeContext"
import { toast } from "react-toastify"
import { AxiosError } from "axios"

type RoleContextType = {
	isLoading: boolean
	getRoleNameFromId: (roleId: string) => string
	fetchFeaturesInRole: (roleId: string) => void
	fetchPermissionDataForRole: (roleId: string) => void
	permissionDataForRole: IPermissionData
	roles: IRole[]
	setIsLoading: (isLoading: boolean) => void
	resetPermissionData: () => void
	updatePermissionDataForRole: (updatedPermissionData: IPermissionData) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export const RoleProvider = ({ children, basePath }: { children: React.ReactNode; basePath: string }) => {
	const { currentTab } = useSafeTabChange()
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [permissionDataForRole, setPermissionDataForRole] = useState<IPermissionData>(
		roleContextDefaultValues.permissionDataForRole
	) // Remember to use this when api is ready with operations: []
	const [roles, setRoles] = useState<IRole[]>([]) // Remmeber to use this when api is ready with operations: []

	useEffect(() => {
		resetPermissionData() // This ensures the tab data is reset when tab is changed
	}, [currentTab])

	useEffect(() => {
		const fetchAllRoles = async () => {
			if (basePath) {
				setIsLoading(true)
				await RolesRepositories.getAllRoles(basePath)
					.then((response) => {
						setRoles(response.data)
					})
					.catch((err: AxiosError) => console.error(err))
			}
		}

		fetchAllRoles().then(() => setIsLoading(false))
	}, [basePath])

	const fetchFeaturesInRole = async (roleId: string) => {
		if (basePath) {
			setIsLoading(true)
			await RolesRepositories.getFeaturesInRole(basePath, roleId)
				.then((response) => {
					setRoles(response.data)
				})
				.catch((err: AxiosError) => console.error(err))
				.finally(() => setIsLoading(false))
		}
	}

	const getRoleNameFromId = (roleId: string) => {
		const nameFromId = roles.find((role) => role.accessRoleId === roleId)
		return nameFromId ? nameFromId.name : ""
	}

	const fetchPermissionDataForRole = async (roleId: string) => {
		if (basePath) {
			setIsLoading(true)
			await RolesRepositories.getPermissionDataForRole(basePath, roleId)
				.then((response) => {
					setPermissionDataForRole(response.data)
				})
				.catch((err: AxiosError) => console.error(err))
				.finally(() => setIsLoading(false))
		}
	}

	const updatePermissionDataForRole = async (updatedPermissionRole: IPermissionData) => {
		if (basePath) {
			setIsLoading(true)
			await RolesRepositories.putPermissionDataForRole(basePath, updatedPermissionRole)
				.then((response) => {
					fetchPermissionDataForRole(updatedPermissionRole.accessRoleId)
					toast.success("Rolle oppdatert.", {
						role: "alert"
					})
				})
				.catch((err: AxiosError) => {
					toast.error("Rolleoppdatering feilet.", {
						role: "alert"
					})
					console.error(err)
				})
		}
	}

	const resetPermissionData = () => {
		setPermissionDataForRole(roleContextDefaultValues.permissionDataForRole)
	}

	return (
		<RoleContext.Provider
			value={{
				isLoading,
				getRoleNameFromId,
				fetchFeaturesInRole,
				fetchPermissionDataForRole,
				permissionDataForRole,
				roles,
				setIsLoading,
				resetPermissionData,
				updatePermissionDataForRole
			}}
		>
			{children}
		</RoleContext.Provider>
	)
}

export const useRole = (): RoleContextType => {
	const data = useContext(RoleContext)
	if (data === undefined) {
		throw new Error("useData must be used within a DataProvider")
	}
	return data
}
