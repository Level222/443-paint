import html from "../../utils/html.js";

const Download = ({ size = 24, color = "#ffffff" }) => html`
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
    <path
      d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"
    />
  </svg>
`;

export default Download;
