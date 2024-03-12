import { Tag } from 'antd'
import { userRoleNaming } from '../api/users'

export const generateRoleTagColor = (role: string) => {
    switch (role) {
        case 'superAdmin':
            return "volcano"
        case 'admin':
            return "gold"
        case 'publicUser':
            return "blue"
        default:
            return ""
    }
}

export const generateRoleName = (role: string) => {
    return userRoleNaming[role] || ""
}