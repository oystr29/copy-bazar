const paymentStatus = (status?: string) => {
  if (status === "pending") {
    return {
      border: "border-orange-500",
      text: "Belum Bayar",
      color: "text-orange-500",
    };
  }
  if (status === "expire") {
    return {
      border: "border-gray-500",
      text: "Kadaluarsa",
      color: "text-gray-500",
    };
  }
  if (status === "settlement") {
    return {
      border: "border-green-500",
      text: "Sudah Bayar",
      color: "text-green-500",
    };
  }
  return {
    border: "border-black",
    text: status,
    color: "text-black",
  };
};

export { paymentStatus };
