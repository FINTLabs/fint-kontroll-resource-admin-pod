import React, { useEffect, useRef } from "react"
import { useSafeTabChange } from "../../../api/SafeTabChangeContext"
import { Button, Modal } from "@navikt/ds-react"

// interface ConfirmSaveModalProps {
// 	modifiedAssignment: IAssignment
// }

export const ConfirmSafeRedirectModal = () => {
	const ref = useRef<HTMLDialogElement>(null)
	const { tabToRouteTo, setCurrentTab, setIsTabModified, isModalVisible, setIsModalVisible } = useSafeTabChange()

	useEffect(() => {
		isModalVisible ? handleOpenModal() : handleSaveChanges()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isModalVisible])

	const handleSaveChanges = (shouldSave?: boolean) => {
		if (shouldSave) {
			setIsTabModified(false)
			setIsModalVisible(false)
			setCurrentTab(tabToRouteTo)
		}
		ref.current?.close()
	}

	const handleOpenModal = () => {
		ref.current?.showModal()
	}

	const handleDiscardChanges = () => {
		setIsTabModified(false)
		setIsModalVisible(false)
		ref.current?.close()
		setCurrentTab(tabToRouteTo)
	}

	return (
		<div className="py-16">
			<Modal
				ref={ref}
				header={{ heading: "Lagre endringer" }}
				onClose={handleDiscardChanges}
				onCancel={handleDiscardChanges}
			>
				<Modal.Body>Du har data som ikke er lagret. Ønsker du å forkaste endringene?</Modal.Body>
				<Modal.Footer>
					<Button type="button" onClick={() => handleSaveChanges(true)}>
						Lagre endringer
					</Button>
					<Button type="button" variant="secondary" onClick={() => handleDiscardChanges()}>
						Forkast endringer
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	)
}
