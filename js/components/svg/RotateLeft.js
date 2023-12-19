import html from "../../utils/html.js";

const RotateRight = ({ size = 24, color = "#ffffff" }) => html`
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width=${size}
    height=${size}
    viewBox="0 0 24 24"
    fill="none"
    stroke=${color}
    strokeWidth="2"
    strokeLinecap="square"
    strokeLinejoin="round"
  >
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
  </svg>
`;

export default RotateRight;
