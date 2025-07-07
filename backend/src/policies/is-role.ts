export default (policyContext, config, { strapi }) => {
  const user = policyContext.state.user;
  
  if (!user) {
    console.log('Policy check failed: No user found');
    return false;
  }
  
  if (!user.role) {
    console.log(`Policy check failed: User ${user.username} has no role`);
    return false;
  }
  
  const hasRole = user.role.name === config.role;
  
  if (!hasRole) {
    console.log(`Policy check failed: User ${user.username} has role "${user.role.name}" but needs "${config.role}"`);
  } else {
    console.log(`Policy check passed: User ${user.username} has correct role "${config.role}"`);
  }
  
  return hasRole;
}; 