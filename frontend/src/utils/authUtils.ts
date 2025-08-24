export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem("userToken");
};

export const getProfilePictureUrl = (): string | null => {
  const caminhoFoto = localStorage.getItem("userProfilePic");
  if (caminhoFoto) {
    return `http://localhost/gardenme/backend/public/uploads/profile_pictures/${caminhoFoto}?t=${Date.now()}`;
  }
  return null;
};

export const logout = (): void => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userProfilePic");
  window.dispatchEvent(new Event("storage"));
};