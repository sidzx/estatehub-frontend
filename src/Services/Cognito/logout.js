
import userPool from './Userpool';

export const logout = () => {
    const currentUser = userPool.getCurrentUser();
    
    if (currentUser) {
        currentUser.signOut(); // Logs out the user
        sessionStorage.clear()
        
    }
};
