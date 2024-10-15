window.addEventListener('load', (() => {
    const loginBtn = document.getElementById('loginBtn');
    const closeModal = document.getElementById('closeLoginModal');
    const loginModal = document.getElementById('loginModal');

    loginBtn.addEventListener('click', () => {
        loginModal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
        loginModal.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.classList.add('hidden');
        }
    });
}));
