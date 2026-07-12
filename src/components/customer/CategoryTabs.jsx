const CategoryTabs = ({
  categories,
  selectedCategory,
  setSelectedCategory, }) => {

  return (
    <div
      className=" flex gap-3 overflow-x-auto py-3"
    >

      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() =>
            setSelectedCategory(category.name)
          }
          className={`  px-5  py-2  rounded-full  whitespace-nowrap
            ${selectedCategory === category.name
              ? "bg-orange-500 text-white"
              : "bg-white border"
            }
          `}
        >
          {category.name}
        </button>
      ))}

    </div>
  );
};

export default CategoryTabs;