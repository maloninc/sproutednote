// ==========================================================================
// SN.Note Fixtures
// ==========================================================================

require('core') ;

SN.FIXTURES = SN.FIXTURES.concat([

  // TODO: Add your data fixtures here.
  // All fixture records must have a unique guid and a type matching the
  // name of your contact.  See the example below.
  {guid: 1,
   type: 'Note',
   docId:'0001',
   created:'2008-06-24 00:03:00',
   modified:'2008-06-27 10:23:00',
   uid:'1',
   isPublic:false,
   title:"Sample1",
   text: "*Hello\n[table]\nAAAA|bbbb|cc\n123|333| 4444\n[/table]\n-task1\n-task2\n+task3\n\n\n\n[[sample2]]\n\n[code]\nint a = 0;\na++;\n\nb++;\n[/code]\n\n\n\n\n\nHello again!\n\n\n\n\nGood bye!"
  },
  {guid: 2,
   type: 'Note',
   docId:'0002',
   created:'2008-06-23 15:43:00',
   modified:'2008-06-27 10:23:00',
   uid:'1',
   isPublic:false,
   title:"Sample2",
   text: "----\nGood morning\n----"
  },
  {guid: 3,
   type: 'Note',
   docId:'0003',
   created:'2008-06-23 15:43:00',
   modified:'2008-06-27 10:23:00',
   uid:'1',
   isPublic:false,
   title:"Sample3",
   text: "http://www.google.com/"
  },
  {guid: 4,
   type: 'Note',
   docId:'0004',
   created:'2008-06-23 15:43:00',
   modified:'2008-06-27 10:23:00',
   uid:'1',
   isPublic:false,
   title:"Sample4",
   text: "-list1\n-list2"
  },
  {guid: 5,
   type: 'Note',
   docId:'0005',
   created:'2008-06-23 15:43:00',
   modified:'2008-06-27 10:23:00',
   uid:'1',
   isPublic:false,
   title:"Sample5",
   text: "*ToDo List"
  }

]);
