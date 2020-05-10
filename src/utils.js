function hasPermission(user, permissionsNeeded) {
  const matchedPermissions = user.permissions.filter(
    permissionTheyHave => permissionsNeeded.includes(permissionTheyHave),
  );
  if (!matchedPermissions.length) {
    throw new Error(
      `You do not have sufficient permissions (${permissionsNeeded.join(', ')}) to perform this action.`,
    );
  }
}

function itemOwnershipError() {
  throw new Error('You cannot perform this action because you do not own this item');
}

function signInError() {
  throw new Error('You msut be signed in to perform this action');
}

exports.hasPermission = hasPermission;
exports.itemOwnershipError = itemOwnershipError;
exports.signInError = signInError;
