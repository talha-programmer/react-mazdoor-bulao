import HomeIcon from "@material-ui/icons/Home";
import BookIcon from "@material-ui/icons/Book";
function sharedMenuItems() {
  return [
    {
      link: "/",
      name: "Home",
      icon: <HomeIcon className="text-white" />
    },
    {
      link: "/blog",
      name: "Blog",
      icon: <BookIcon className="text-white" />
    },
    {
      link: "/jobs",
      name: "Jobs",
      icon: <BookIcon className="text-white" />
    }
  ];
}

export default sharedMenuItems();
