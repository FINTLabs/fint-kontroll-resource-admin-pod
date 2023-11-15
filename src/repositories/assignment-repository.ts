import axios from "axios"
import { IAssignment } from "../api/types"

interface IPreparedAssignment {
	userId: string
	scopeId: number
	accessRoleId: string
	orgUnitIds: string[]
}
const postNewAssignment = (basePath: string, newAssignment: IAssignment) => {
	const baseUrl = `${basePath === "/" ? "" : basePath}/api/accessmanagement/v1/accessassignment`
	const url = `${baseUrl}`
	const preparedAssignmentBody: IPreparedAssignment = {
		userId: String(newAssignment.user.resourceId),
		scopeId: newAssignment.scopeId,
		accessRoleId: newAssignment.accessRoleId,
		orgUnitIds: newAssignment.orgUnits.map((orgunit) => String(orgunit.id))
	}
	return axios.post(url, preparedAssignmentBody)
}

const AssignmentRepository = {
	postNewAssignment
}

export default AssignmentRepository