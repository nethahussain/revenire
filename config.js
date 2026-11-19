/* ============================================================
   REVENIRE: edit this file to update the reunion details.
   Leave a value as "" and the site shows "To be announced".
   Public site: put NO phone numbers, addresses or emails here
   unless the person has agreed to it.
   ============================================================ */
window.REVENIRE = {
  batch: "53rd MBBS Batch",
  college: "Government Medical College, Kozhikode",
  admissionYear: 2009,
  dateISO: "2026-12-19T14:30:00+05:30",       // start of day one (IST)
  dateLabel: "Saturday 19 & Sunday 20 December 2026",
  dateNote: "From 2:30 pm on Saturday until noon on Sunday.",
  venue: "Kadavu Resort & Calicut Medical College",
  venueNote: "Saturday at Kadavu Resort, Kozhikode. Sunday at Saju Hall, back in our college.",
  dayVenues: { Saturday: "Kadavu Resort", Sunday: "Saju Hall, Calicut Medical College" },
  venueAddress: "",
  mapUrl: "",
  /* The batch and family photo albums are private on purpose: do not put their links here. */
  listAsOf: "15 November 2026",

  /* Names only, from the RSVP sheet column "19&20" = Y. No other details. */
  coming: [
    "Abhinav Chandran","Abna P K","Aishwarya Raj","Akhil M Velayudhan","Ali Shabith","Ambika Premarajan",
    "Ameena Shagal S","Anjana C","Annie Joseph","Arun Nirmal","Arun Radhakrishnan","Arun Vadakkumpat",
    "Arunnath K","Aswathi P K","Aswin P","Athira R","Ben Xavier","Bijin Joseph","Dan Kuriakose",
    "Deepika T M","Dhyana","Dinnu Gopal","Dinsha","Drishya Dinesh","Greeshma P R","Gulam Muhammed Shafeeq",
    "Habeeba C","Indu","Jabin Ashraf T P","Jamshad","Jannat Jalal","Jaseem Sajjad K","Jasir","Jassim K P",
    "Jithin Raj","Juhina","Jyothis Merry","Kaleem Ahmed","Manish","Manjima","Mohamed Mansoof K",
    "Mohammed Muhsin","Mohammed Nihad","Muhsina","Najla","Naseef","Neethu N T","Neethu Santosh","Nesva",
    "Netha Hussain","Nikitha Ahamed","Nikitha N K","Nimisha P V","Nithya","Ramsiya E V","Sai Krishnan",
    "Saify Samad","Sajini","Samily R Nath","Saumya","Shafeeque Ahamed","Shahana M","Shahana P","Shaheen",
    "Shamna K","Shana Rahman","Shanas K P","Sharafudheen Mammu","Sharmina K T","Sherindas P","Shinas",
    "Shirin A","Shruthi S Jayaraj","Siyad Ahammad","Sona S","Soorya K","Sreedevi","Sreeshma Varghese",
    "Sruthi Haridas","Sruthi P","Sruthin M","Syam","Uwais P","Vaishak V K","Varada","Varsha S","Varsha V P"
  ],

  /* RSVP-sheet name -> slam book name, where the spelling differs. */
  aliases: {
    "Neethu Santosh": "Neethu Santhosh", "Dan Kuriakose": "Dan Faustino Kuriakose", "Indu": "Indu V P",
    "Kaleem Ahmed": "Kaleem Ahammed", "Mohammed Muhsin": "Mohamed Muhsin K", "Nikitha Ahamed": "Nikitha K Ahamed",
    "Syam": "Syam S Kumar", "Vaishak V K": "Vaisakh V K"
  },

  programme: [
    { day: "Saturday", time: "2:30 pm", title: "Programme begins", note: "At Kadavu Resort." },
    { day: "Saturday", time: "4:30 pm", title: "Helium balloon release and group photo", note: "" },
    { day: "Saturday", time: "Then", title: "Tea and snacks", note: "" },
    { day: "Saturday", time: "Evening", title: "Cultural programmes with running dinner", note: "" },
    { day: "Saturday", time: "Late", title: "DJ", note: "" },
    { day: "Saturday", time: "Night", title: "Stay at Kadavu", note: "For those who have booked accommodation." },
    { day: "Sunday",   time: "10 am", title: "Gathering at Saju Hall", note: "In the college, where we sat through our lectures." },
    { day: "Sunday",   time: "Then", title: "Tea and photo shoot", note: "" },
    { day: "Sunday",   time: "Noon", title: "Dispersal", note: "Until the next Revenire." }
  ]
};
