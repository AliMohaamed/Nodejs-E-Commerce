import Role from "../../DB/models/role.models.js";
import { User } from "../../DB/models/user.model.js";

export const seedRoles = async () => {
  try {
    // Define roles with their default permissions
    const rolesData = [
      {
        name: "admin",
        permissions: ["READ", "WRITE", "DELETE"],
      },
      {
        name: "user",
        permissions: ["READ"],
      },
    ];

    for (const roleData of rolesData) {
      const existingRole = await Role.findOne({ name: roleData.name });
      if (!existingRole) await Role.create(roleData);
    }

    // Get admin role for creating admin user
    const adminRole = await Role.findOne({ name: "admin" });

    const adminExists = await User.findOne({ roles: adminRole._id });

    if (!adminExists) {
      const admin = new User({
        name: "Admin",
        email: "admin@ecommerce.com",
        password: "Admin@123",
        roles: [adminRole._id],
        isConfirmed: true,
      });
      await admin.save();
    }

    console.log("Roles and admin user seeding completed successfully");
  } catch (error) {
    console.error("Error seeding roles:", error);
    throw error;
  }
};
