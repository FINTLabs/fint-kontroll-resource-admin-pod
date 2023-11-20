import { IUserRole } from "../../../api/types"
import { Button, Modal } from "@navikt/ds-react"
import React, { useEffect, useRef, useState } from "react"
import EditUserAssignment from "./edit-user-assignment"
import AssignmentRepository from "../../../repositories/assignment-repository"
import { useGeneral } from "../../../api/generalContext"

interface ChangeAssignmentsModalProps {
	assignmentToChange: IUserRole
	modalOpenProp: boolean
	setIsModalOpen: (isOpen: boolean) => void
}
const ChangeAssignmentsModal = ({ assignmentToChange, modalOpenProp, setIsModalOpen }: ChangeAssignmentsModalProps) => {
	const ref = useRef<HTMLDialogElement>(null)
	const { basePath } = useGeneral()
	const [updatedAssignment, setUpdatedAssignment] = useState<IUserRole>(assignmentToChange)

	useEffect(() => {
		if (assignmentToChange.roleId.length > 0 || modalOpenProp) {
			openModal()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [assignmentToChange, modalOpenProp])

	const openModal = () => {
		setIsModalOpen(true)
		ref.current?.showModal()
	}

	const closeModal = () => {
		setIsModalOpen(false)
		ref.current?.close()
	}

	const handleSubmitChangesToRole = () => {
		// Call PUT-endpoint in assignment-repository
		// TODO: fix this when API is ready
		AssignmentRepository.putAssignment(basePath, updatedAssignment)
		//Submit new assignment data to API when API is ready
		closeModal()
	}

	return (
		<div className="py-16">
			<Modal
				ref={ref}
				header={{ heading: `Endre ${assignmentToChange?.roleName}` }}
				onCancel={closeModal}
				onAbort={closeModal}
			>
				<Modal.Body>
					<EditUserAssignment
						assignmentDetails={updatedAssignment}
						setUpdateAssignmentWhenDeletingOrgUnit={setUpdatedAssignment}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button type="button" onClick={() => handleSubmitChangesToRole()}>
						Lagre
					</Button>
					<Button type="button" variant="secondary" onClick={closeModal}>
						Avbryt
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}

export default ChangeAssignmentsModal
