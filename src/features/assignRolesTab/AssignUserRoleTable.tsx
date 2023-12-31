import { Button, Loader, Pagination, Select, Table } from "@navikt/ds-react"
import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useUser } from "../../api/UserContext"
import { IAssignment, IUser } from "../../api/types"
import { useSafeTabChange } from "../../api/SafeTabChangeContext"
import ExistingAssignmentModal from "./ExistingAssignmentModal"
import { useGeneral } from "../../api/GeneralContext"
import { useAssignments } from "../../api/AssignmentContext"
import { useLocation } from "react-router-dom"

const PaginationWrapper = styled.div`
	display: flex;
	justify-content: flex-end;
	align-items: flex-end;
	gap: 1rem;
`

const TableStyled = styled(Table)`
	thead {
		th:nth-child(n) {
			width: 33%;
		}
	}

	.loading-table {
		td {
			border-bottom: none;
		}
	}

	.selected-table-row {
		background-color: grey;

		:hover {
			background-color: transparent;
		}
	}
`

const LoaderWrapper = styled.div`
	width: 100%;
	text-align: center;
	padding: 5rem 0;
`

interface AssignUserRoleTableProps {
	newAssignment: IAssignment
	setNewAssignment: (updatedAssignment: IAssignment) => void
	setHasChanges: (hasChanges: boolean) => void
	setUser: (user: IUser) => void
	handlePagination: (newPage: number) => void
}

const AssignUserRoleTable = ({
	newAssignment,
	setNewAssignment,
	setHasChanges,
	setUser,
	handlePagination
}: AssignUserRoleTableProps) => {
	const { basePath } = useGeneral()
	const { setIsTabModified } = useSafeTabChange()

	const location = useLocation()
	const searchParams = new URLSearchParams(location.search)
	const page = searchParams.get("page")

	const {
		currentPage,
		itemsPerPage,
		isLoading,
		orgUnitIds,
		getUsersPage,
		setCurrentPage,
		setItemsPerPage,
		searchString,
		roleFilter,
		usersPage
	} = useUser()
	const { userDetailsPage, getUserOrgUnitsNoPagination } = useAssignments()

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [roleDataForModal, setRoleDataForModal] = useState<IUser | undefined>()

	useEffect(() => {
		if (page) {
			setCurrentPage(Number(page))
		} else {
			setCurrentPage(1)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		getUsersPage()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [basePath, currentPage, itemsPerPage, searchString, orgUnitIds, roleFilter])

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLSelectElement | HTMLOptionElement>) => {
		setItemsPerPage(parseInt(event.target.value, 10))
		setCurrentPage(1)
	}

	if (isLoading) {
		return (
			<LoaderWrapper>
				<Loader size="3xlarge" title="Venter..." />
			</LoaderWrapper>
		)
	}

	const handleSelectUser = (user: IUser) => {
		setNewAssignment({ ...newAssignment, user: user })
		setHasChanges(true)
		setIsTabModified(true)
		setUser(user)
	}

	const getExistingRoleData = (user: IUser) => {
		setIsModalOpen(true)
		if (user.roles) {
			setRoleDataForModal(user)
		}
		setRoleDataForModal(user)
		getUserOrgUnitsNoPagination(user.resourceId)
	}
	return (
		<>
			<ExistingAssignmentModal
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				userDetailsPage={userDetailsPage ? userDetailsPage : null}
				userFullName={
					roleDataForModal?.firstName ? roleDataForModal?.firstName + roleDataForModal?.lastName : ""
				}
			/>
			<TableStyled id={"rettigheter-table-delegation"}>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Navn</Table.HeaderCell>
						<Table.HeaderCell align={"center"}>Rolletildeling</Table.HeaderCell>
						<Table.HeaderCell align={"center"}>Velg bruker</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{usersPage?.users.map((user, index) => (
						<Table.Row key={index} selected={newAssignment.user?.resourceId === user.resourceId}>
							<Table.DataCell>{user.firstName + " " + user.lastName}</Table.DataCell>
							{user.roles?.length === 0 ? (
								<Table.DataCell align={"center"}>Ingen eksisterende tildeling</Table.DataCell>
							) : (
								<Table.DataCell align={"center"}>
									<Button onClick={() => getExistingRoleData(user)}>Se tildelingsinformasjon</Button>
								</Table.DataCell>
							)}
							<Table.DataCell align={"center"}>
								{newAssignment.user?.resourceId === user.resourceId ? (
									<Button onClick={() => handleSelectUser(user)}>Valgt</Button>
								) : (
									<Button variant={"secondary"} onClick={() => handleSelectUser(user)}>
										Ikke valgt
									</Button>
								)}
							</Table.DataCell>
						</Table.Row>
					))}
				</Table.Body>
			</TableStyled>

			<PaginationWrapper>
				<Select
					label="Rader per side"
					size="small"
					onChange={handleChangeRowsPerPage}
					defaultValue={itemsPerPage}
				>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={25}>25</option>
					<option value={50}>50</option>
				</Select>
				<Pagination
					id="pagination"
					page={currentPage ? currentPage : 1}
					onPageChange={handlePagination}
					count={Math.ceil((usersPage ? usersPage.totalItems : 1) / itemsPerPage)}
					size="small"
				/>
			</PaginationWrapper>
		</>
	)
}

export default AssignUserRoleTable
