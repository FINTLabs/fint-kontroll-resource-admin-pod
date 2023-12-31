// types.ts

// This interface is used in "Tildel rettigheter" to structure the connection between an IUser, IRole and IOrgUnit
// TODO: Control check this when API is done!!
export interface IAssignment {
	user: IUser
	accessRoleId: string
	scopeId: number
	orgUnits: IOrgUnit[]
}

export interface IRole {
	accessRoleId: string
	name: string
}

// PermissionData is a role and its subsequent mapping to features and operation sets
export interface IPermissionData {
	accessRoleId: string
	features: IFeatureOperation[]
}

export interface IFeatureOperation {
	featureId: number
	featureName: string
	operations: string[]
}

// Features reside in a Role, but not as part of its type from the API
export interface IFeature {
	name: string
	id: string
	path: string
}

export interface IOrgUnit {
	id: number
	name: string
	organisationUnitId: string
	parentRef: string
	parentName: null | string
	childrenRef: string[]
}

// This type is used for when orgunits are retrieved with pagination. Not often used
export interface IOrgUnitsPaginated {
	totalItems: number
	orgUnits: IOrgUnit[]
	totalPages: number
	currentPage: number
}

export interface IUserPage {
	totalItems: number
	users: IUser[]
	totalPages: number
	currentPage: number
}

// Used for a User's tildelingsadministrasjon page
export interface IUserDetailsPage {
	totalItems: number
	totalPages: number
	currentPage: number
	accessRoles: IUserDetail[]
}
export interface IUserDetail {
	accessRoleId: string
	accessRoleName: string
	orgUnits: IOrgUnitDetail[]
}
export interface IOrgUnitDetail {
	scopeId: number
	objectType: string
	orgUnitId: string
	name: string
}
// ----

export interface IUser {
	id: number
	resourceId: string
	firstName: string
	lastName: string
	userType: string
	userName: string
	roles?: IUserRole[] // Optional to allow use of same type
}

export interface IUserRole {
	roleId: string
	roleName: string
	scopes: IScope[] // Optional to allow use of same type
}

export interface IScope {
	objectType: string
	orgUnits: IOrgUnitForScope[]
	scopeId: string
}

export interface IOrgUnitForScope {
	name: string
	orgUnitId: string
	shortName: string
}

// -----------------------

export type UsersContextState = {
	basePath: string
	currentPage: number
	isAggregate: boolean
	isLoading: boolean
	itemsPerPage: number
	orgUnitIds: string[]
	getUsersPage: () => void
	selected: number[]
	setCurrentPage: (currentPageNumber: number) => void
	setIsLoading: (isLoading: boolean) => void
	setItemsPerPage: (paginationSize: number) => void
	setOrgUnitIds: (orgUnitIds: string[]) => void
	setSelected: (selected: number[]) => void
	usersPage: IUserPage | null
}

export const userContextDefaultValues: UsersContextState = {
	basePath: "/",
	currentPage: 1,
	isAggregate: false,
	isLoading: false,
	itemsPerPage: 5,
	orgUnitIds: [],
	setCurrentPage: (currentPageNumber: number) => void {},
	getUsersPage(): void {},
	setIsLoading(isLoading: boolean): void {},
	selected: [],
	setItemsPerPage: (paginationSize: number) => void {},
	setOrgUnitIds(orgUnits: string[]): void {},
	setSelected(selected: number[]): void {},
	usersPage: null
}

// ------------------------

export type RoleContextState = {
	basePath: string
	currentPage: number
	isAggregate: boolean
	isLoading: boolean
	itemsPerPage: number
	permissionDataForRole: IPermissionData
	selected: number[]
	setCurrentPage: (currentPageNumber: number) => void
	setIsLoading: (isLoading: boolean) => void
	setItemsPerPage: (paginationSize: number) => void
	setSelected: (selected: number[]) => void
}

export const roleContextDefaultValues: RoleContextState = {
	basePath: "/",
	currentPage: 1,
	isAggregate: false,
	isLoading: false,
	itemsPerPage: 5,
	permissionDataForRole: {
		accessRoleId: "",
		features: [{ featureId: 1, featureName: "", operations: [] }]
	},
	setCurrentPage: (currentPageNumber: number) => void {},
	setIsLoading(isLoading: boolean): void {},
	selected: [],
	setItemsPerPage: (paginationSize: number) => void {},
	setSelected(selected: number[]): void {}
}
