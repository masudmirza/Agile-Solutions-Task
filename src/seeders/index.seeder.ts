import mongoose, { Schema } from 'mongoose';
import { PermissionName } from '../domain/enums/permission.enum';
import { RoleName } from '../domain/enums/role.enum';
import Permission from '../domain/models/permission.model';
import Role from '../domain/models/role.model';
import RolePermission from '../domain/models/role-permission.model';

const roles = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: RoleName.ADMIN,
    permissions: []
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: RoleName.SUPERVISOR,
    permissions: []
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: RoleName.OPERATOR,
    permissions: []
  },
];

const permissions = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: PermissionName.GET_USER,
    roles: []
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: PermissionName.GET_ALL_USERS,
    roles: []
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: PermissionName.UPDATE_USER,
    roles: []
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: PermissionName.DELETE_USER,
    roles: []
  },
];

const rolePermissions = [
  {
    roleId: roles[0]._id,
    permissionId: permissions[0]._id
  },
  {
    roleId: roles[0]._id,
    permissionId: permissions[1]._id
  },
  {
    roleId: roles[0]._id,
    permissionId: permissions[2]._id
  },
  {
    roleId: roles[0]._id,
    permissionId: permissions[3]._id
  },
  {
    roleId: roles[1]._id,
    permissionId: permissions[0]._id
  },
  {
    roleId: roles[1]._id,
    permissionId: permissions[1]._id
  },
  {
    roleId: roles[1]._id,
    permissionId: permissions[2]._id
  },
  {
    roleId: roles[2]._id,
    permissionId: permissions[0]._id
  },
  {
    roleId: roles[2]._id,
    permissionId: permissions[1]._id
  },
];

export default async function seed() {
    try {
      const newRoles = [];
      const newPermissions = [];
      const newRolePermissions = [];
  
      for (const role of roles) {
        const existRole = await Role.findOne({ name: role.name });
        if (existRole) {
          role._id = existRole._id;
        } else {
          const newRole = new Role(role);
          await newRole.save();
          newRoles.push(newRole);
        }
      }
  
      for (const permission of permissions) {
        const existPermission = await Permission.findOne({ name: permission.name });
        if (existPermission) {
          permission._id = existPermission._id;
        } else {
          const newPermission = new Permission(permission);
          await newPermission.save();
          newPermissions.push(newPermission);
        }
      }
  
      for (const rp of rolePermissions) {
        const existRolePermission = await RolePermission.findOne({
          roleId: rp.roleId,
          permissionId: rp.permissionId,
        });
  
        if (existRolePermission) {
          continue;
        }
  
        const existRole = await Role.findById(rp.roleId);
        const existPermission = await Permission.findById(rp.permissionId);
  
        if (!existRole || !existPermission) {
          continue;
        }
  
        const newRolePermission = new RolePermission({
          roleId: existRole._id,
          permissionId: existPermission._id,
        });
  
        await newRolePermission.save();
        newRolePermissions.push(newRolePermission);
      }
  
      console.log('Seeding completed successfully.');      
  } catch (error) {
    console.error(error);
  }
}
