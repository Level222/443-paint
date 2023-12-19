import html from "../../utils/html.js";

const RotateLeft = ({ size = 24, color = "#ffffff" }) => html`
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
    <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38" />
  </svg>
`;

export default RotateLeft;
