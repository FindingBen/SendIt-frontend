const formatDate = (inputDate) => {
    const date = new Date(inputDate);
  
    // Get year, month, and day components
    const year = date.getFullYear();
    // JavaScript months are 0-based, so we add 1 to get the correct month.
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    // Create the formatted date string in the desired format (YYYY-MM-DD)
    const formattedDate = `${year}-${month}-${day}`;
  
    return formattedDate;
  };
  
  export default formatDate;
  