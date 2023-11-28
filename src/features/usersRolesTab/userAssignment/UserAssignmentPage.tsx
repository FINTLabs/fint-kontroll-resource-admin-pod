import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { Box, Button, Heading, Select } from "@navikt/ds-react"
import { ArrowBack } from "@mui/icons-material"
import { useEffect, useState } from "react"
import { useUser } from "../../../api/UserContext"
import { IRole, IUser, IUserRole } from "../../../api/types"
import { LoaderStyled } from "../../index"
import RoleOrgunitAssociationTable from "./RoleOrgunitAssociationTable"
import ChangeAssignment from "./modals/ChangeAssignment"
import DeleteAssignment from "./modals/DeleteAssignment"
import { useRole } from "../../../api/RoleContext"
import { toast } from "react-toastify"

const UserAssignmentContainer = styled.div`
	display: flex;
	flex-direction: column;
	gap: 2rem;

	.navds-select__container {
		width: fit-content;
	}
`

interface UserAssignmentPageProps {
	basePath: string
}

const UserAssignmentPage = ({ basePath }: UserAssignmentPageProps) => {
	const { userId } = useParams()
	const { roles } = useRole()
	const { isLoading, setIsLoading, getSpecificUserById } = useUser()
	const [user, setUser] = useState<IUser>()
	const [assignmentToChange, setAssignmentToChange] = useState<IUserRole>({
		roleId: "",
		roleName: "",
		scopes: []
	})
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [assignmentToDelete, setAssignmentToDelete] = useState<IUserRole | undefined>()
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [selectedRole, setSelectedRole] = useState<IRole>({ accessRoleId: "", name: "" })
	const navigate = useNavigate()

	useEffect(() => {
		const getUserById = () => {
			if (userId) {
				setIsLoading(true)

				getSpecificUserById(userId)
					.then((user) => {
						setUser(user)
					})
					.catch((error) => {
						console.error("Error fetching user:", error)
					})
					.finally(() => {
						setIsLoading(false)
					})
			}
		}
		getUserById()
		// Must add the eslint disable in order to avoid infinite loops cause by adding getUserById as a dependency.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setIsLoading, userId, basePath])

	const goBack = () => {
		navigate(-1) // Navigate back in the history
	}

	const handleChangeRole = (selectedRoleParam: string) => {
		const paramMappedToAccessRoleType: IRole | undefined = roles.find(
			(role) => role.accessRoleId === selectedRoleParam
		)
		if (paramMappedToAccessRoleType === undefined) {
			setSelectedRole({ accessRoleId: "", name: "" })
			toast.error("Noe gikk galt ved valg av rolle")
		} else {
			setSelectedRole(paramMappedToAccessRoleType)
		}
	}

	const toggleChangeModal = (assignmentToChange: IUserRole) => {
		setAssignmentToChange(assignmentToChange)
		setIsModalOpen(true)
	}

	const toggleDeleteModal = (assignmentToChange: IUserRole) => {
		setAssignmentToDelete(assignmentToChange)
		setIsDeleteModalOpen(true)
	}

	if (isLoading) {
		return <LoaderStyled size={"3xlarge"} />
	}

	// Filter for data to feed into table component
	const scopeFromUserRole = user?.roles?.find((role) => role.roleId === selectedRole.accessRoleId)

	return (
		<UserAssignmentContainer>
			<div>
				<Button icon={<ArrowBack aria-hidden />} variant={"secondary"} onClick={goBack}>
					Gå tilbake
				</Button>
			</div>
			{isLoading ? (
				<LoaderStyled size="3xlarge" title="Laster inn brukerdata..." />
			) : (
				<div>
					<Box>
						<Heading size={"small"}>Brukerinfo</Heading>
						Navn: {user?.firstName} {user?.lastName}
					</Box>

					<Select
						label={"Velg rolle"}
						value={selectedRole.accessRoleId}
						onChange={(event) => handleChangeRole(event.target.value)}
					>
						<option value={""}>Velg rolle</option>
						{user?.roles?.map((role) => (
							<option key={role.roleId} value={role.roleId}>
								{role.roleName}
							</option>
						))}
					</Select>

					<Box>
						<RoleOrgunitAssociationTable
							user={user}
							scopeFromUserRole={scopeFromUserRole}
							toggleChangeModal={toggleChangeModal}
							toggleDeleteModal={toggleDeleteModal}
						/>
					</Box>
				</div>
			)}

			{isModalOpen && (
				<ChangeAssignment
					assignmentToChange={assignmentToChange}
					modalOpenProp={isModalOpen}
					setIsModalOpen={setIsModalOpen}
				/>
			)}
			{isDeleteModalOpen && assignmentToDelete && (
				<DeleteAssignment
					assignmentToDelete={assignmentToDelete}
					modalOpenProp={isDeleteModalOpen}
					setIsDeleteModalOpen={setIsDeleteModalOpen}
				/>
			)}
		</UserAssignmentContainer>
	)
}

export default UserAssignmentPage