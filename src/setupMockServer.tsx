// Import MirageServer from Mirage
import { Server, Response } from "miragejs"

// Define your Mirage server and routes
export function setupMockServer() {
	new Server({
		routes() {
			this.passthrough("/api/orgunits/")
			this.passthrough("/api/layout/configuration")

			// Mock the members endpoint
			this.get("/mock-data/roles/members", () => {
				// Define mock api for IMemberPage
				const memberData = {
					users: [
						{
							id: 1487,
							firstName: "Berit",
							lastName: "Andersen",
							organisationUnitName: "VGSTOR Storskog videregående skole",
							organisationUnitId: "198",
							userType: "STUDENT"
						},
						{
							id: 599,
							firstName: "Elisabeth",
							lastName: "Andersen",
							organisationUnitName: "VGSTOR Storskog videregående skole",
							organisationUnitId: "198",
							userType: "STUDENT"
						},
						{
							id: 707,
							firstName: "Marianne",
							lastName: "Andersen",
							organisationUnitName: "VGSTOR Storskog videregående skole",
							organisationUnitId: "198",
							userType: "STUDENT"
						}
					],
					currentPage: 0,
					totalPages: 78,
					totalItems: 388
				}

				return new Response(200, {}, memberData)
			})
		}
	})
}
