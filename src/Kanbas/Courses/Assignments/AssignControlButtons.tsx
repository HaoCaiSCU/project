import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";

export default function LessonControlButtons() {
  return (
    <div className="float-end">
      <button className="rounded-pill btn-secondary me-2" >
        40% of Total
      </button>
      <BsPlus />
      <IoEllipsisVertical className="fs-4" />
    </div>
);}