let toastTimeout = null;

export function showToast(title, message) {

    const toast = document.getElementById("toast");

    document.getElementById("toastTitle").innerText = title;

    document.getElementById("toastMessage").innerText = message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {

        toast.classList.remove("show");

    }, 4000);

}