import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArchiveIcon from "@mui/icons-material/Archive";
import WarningIcon from "@mui/icons-material/Warning";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { useRecentsGlobalContext } from "../../context/globalrecentscontext";

// function refreshMessages(): MessageExample[] {
  // const getRandomInt = (max: number) =>
  // Math.floor(Math.random() * Math.floor(max));
  // return Array.from(new Array(50)).map(
  //   () => messageExamples[getRandomInt(messageExamples.length)]
  // );

  // try{

  //   messageExamples.concat([{
  //   primary: "Brunch this week?",
  //   secondary:
  //     "This is a test",
  //   person: "/static/images/avatar/5.jpg",      
  //   }])

  // }catch(error) {
  //   console.error('Error - ', error)
  // }
  

// }

function refreshMessages(recents: string, index: number) {

  try{
    if(index == 0) {
      const newMessages = [...messageExamples, {primary: Date().toLocaleString(), secondary: recents, person: "/static/images/avatar/5.jpg"}]
      return newMessages;
    }else if(index == 3) {
      return helpMessages
    }

  }
  catch(error) {
    console.error('Error - ', error)
  }

  // const history: MessageExample[] = ([
  //   {
  //     primary: "Brunch this week?",
  //     secondary:
  //       recents,
  //     person: "/static/images/avatar/5.jpg",
  //   },
  // ]);
  // messageExamples.concat(history);

  // const history: MessageExample = [{
  //   primary: Date.now().toString(),
  //   secondary: recents,
  //   person: "/static/images/avatar/5.jpg"
  // }]

  // messageExamples.concat(history)

  // return Array.from(new Array(50)).map(
  //   () => messageExamples[messageExamples.length]
  // );    
}

export default function FixedBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  // const [messages, setMessages] = React.useState(() => refreshMessages('History'));
  const [messages, setMessages] = React.useState<MessageExample[] | undefined>([]);  
  const [showMessage, setShowMessages] = React.useState<boolean>(false);

  const { recents } = useRecentsGlobalContext();
  const [history, setHistory] = React.useState<string>();

  React.useEffect(() => {
    (ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0;
    setHistory(recents)    
    setMessages(refreshMessages(recents, value));
  }, [value, setMessages, recents]);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      {showMessage ? (
        <List>
          {messages?.map(({ primary, secondary, person }, index) => (
            <ListItem button key={index + person}>
              <ListItemAvatar>
                <Avatar alt="Profile Picture" src={person} />
              </ListItemAvatar>
              <ListItemText primary={primary} secondary={secondary} />
            </ListItem>
          ))}
        </List>
      ) : (
        <div></div>
      )}

      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            if(newValue === 0) {
              console.log(newValue);
              setValue(newValue);
              setShowMessages(!showMessage);
            } else if (newValue === 1) {
              console.log(newValue);
              setValue(newValue);
              //setShowMessages(!showMessage);
            } else if (newValue === 2) {
              console.log(newValue);
              setValue(newValue);
              //setShowMessages(!showMessage);
            } else if (newValue === 3) {
              console.log(newValue);
              setValue(newValue);
              setShowMessages(!showMessage);
            } 

          }}
        >
          <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
          <BottomNavigationAction
            label="Health"
            icon={<HealthAndSafetyIcon />}
          />
          <BottomNavigationAction label="Error" icon={<WarningIcon />} />
          <BottomNavigationAction label="Help" icon={<HelpCenterIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

interface HelpMessages {
  primary: string,
  secondary: string,
  person: string
}

interface MessageExample {
  primary: string;
  secondary: string;
  person: string;
}

const helpMessages: HelpMessages[] = [
  {
    primary: "Platform Events Developer Guide",
    secondary:
      "https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/platform_events_intro.htm",
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "Change Data Capture",
    secondary:
      "https://developer.salesforce.com/docs/atlas.en-us.change_data_capture.meta/change_data_capture/cdc_intro.htm",
    person: "/static/images/avatar/5.jpg",
  },  
  {
    primary: "Execution Governors and Limits",
    secondary:
      "https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_gov_limits.htm", 
    person: "/static/images/avatar/5.jpg",
  },
  {
    primary: "Platform Event Allocations",
    secondary:
      "https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/platform_event_limits.htm", 
    person: "/static/images/avatar/5.jpg",
  },

  
]


const messageExamples: readonly MessageExample[] = [
  // {
  //   primary: "Brunch this week?",
  //   secondary:
  //     "I'll be in the neighbourhood this week. Let's grab a bite to eat",
  //   person: "/static/images/avatar/5.jpg",
  // },
  // {
  //   primary: "Birthday Gift",
  //   secondary: `Do you have a suggestion for a good present for John on his work
  //     anniversary. I am really confused & would love your thoughts on it.`,
  //   person: "/static/images/avatar/1.jpg",
  // },
  // {
  //   primary: "Recipe to try",
  //   secondary:
  //     "I am try out this new BBQ recipe, I think this might be amazing",
  //   person: "/static/images/avatar/2.jpg",
  // },
  // {
  //   primary: "Yes!",
  //   secondary: "I have the tickets to the ReactConf for this year.",
  //   person: "/static/images/avatar/3.jpg",
  // },
  // {
  //   primary: "Doctor's Appointment",
  //   secondary:
  //     "My appointment for the doctor was rescheduled for next Saturday.",
  //   person: "/static/images/avatar/4.jpg",
  // },
  // {
  //   primary: "Discussion",
  //   secondary: `Menus that are generated by the bottom app bar (such as a bottom
  //     navigation drawer or overflow menu) open as bottom sheets at a higher elevation
  //     than the bar.`,
  //   person: "/static/images/avatar/5.jpg",
  // },
  // {
  //   primary: "Summer BBQ",
  //   secondary: `Who wants to have a cookout this weekend? I just got some furniture
  //     for my backyard and would love to fire up the grill.`,
  //   person: "/static/images/avatar/1.jpg",
  // },
];
