import sys
import os
import json

# Add backend directory to python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app import create_app, db
from app.models.case import CaseFile
from app.models.question import Question

app = create_app()

cases_data = [
    {
        "title": "The Vault Heist",
        "slug": "the-vault-heist",
        "story": "At exactly 2:15 AM, a high-security private vault inside a finance office was accessed without any signs of forced entry. By the time authorities were alerted, valuables worth ₹50 lakh had vanished.\n\nWhat made the case more puzzling was the absence of alarms and the fact that the vault showed no physical damage.\n\nSecurity systems reported a 7-minute CCTV blackout, and logs confirmed that the vault was opened using an authorized access card. This was not a random theft. This was planned.",
        "evidence": "📹 CCTV Footage\n- Camera blackout from 2:12 AM to 2:19 AM\n- Just before blackout: A person wearing a security uniform is visible\n\n🔑 Access Logs\n- Vault opened using authorized keycard\n- Card registered to: Rajesh (Night Supervisor)\n\n👣 Physical Evidence\n- Partial shoe print near vault (Size: 9, Type: Industrial safety shoes)\n- Fingerprint found but smudged (likely gloves used)\n\n🧪 Vault Condition\n- No forced entry\n- Lock manually overridden from the inside software panel\n\n☕ Break Room\n- A half-drunk coffee cup found with traces of a mild sedative\n- Rajesh was found asleep in the security room at 2:30 AM\n\n📱 Digital Forensics\n- Rajesh's phone GPS shows he was at the office\n- His phone disconnected from the office WiFi at 1:50 AM",
        "final_verdict_question": "Based on the evidence, who is the primary suspect?",
        "questions": [
            {"prompt": "What time did the CCTV blackout occur?", "options": ["1:50 AM to 2:00 AM", "2:12 AM to 2:19 AM", "2:15 AM to 2:30 AM", "Midnight"], "correct": "2:12 AM to 2:19 AM"},
            {"prompt": "Whose access card was used to open the vault?", "options": ["The Bank Manager", "An unknown card", "Rajesh (Night Supervisor)", "A cloned card"], "correct": "Rajesh (Night Supervisor)"},
            {"prompt": "What physical evidence was left near the vault?", "options": ["A dropped ID card", "A crowbar", "A size 9 industrial shoe print", "A clear fingerprint"], "correct": "A size 9 industrial shoe print"},
            {"prompt": "Why didn't the alarm trigger?", "options": ["The wires were cut", "The power went out", "The lock was manually overridden", "It was never armed"], "correct": "The lock was manually overridden"},
            {"prompt": "What was found in the half-drunk coffee cup?", "options": ["Poison", "A mild sedative", "High levels of caffeine", "Alcohol"], "correct": "A mild sedative"},
            {"prompt": "What happened to Rajesh's phone connection?", "options": ["It turned off", "It disconnected from office WiFi at 1:50 AM", "It made an international call", "It was factory reset"], "correct": "It disconnected from office WiFi at 1:50 AM"},
            {"prompt": "What does the smudged fingerprint indicate?", "options": ["The thief was nervous", "The thief wore gloves", "The surface was wet", "Multiple people touched it"], "correct": "The thief wore gloves"},
            {"prompt": "How did the thief likely bypass the physical security guard (Rajesh)?", "options": ["Bribed him", "Threatened him", "Drugged his coffee", "Tied him up"], "correct": "Drugged his coffee"},
            {"prompt": "Who is seen in the CCTV footage right before the blackout?", "options": ["A masked man", "A person in a security uniform", "Rajesh", "No one"], "correct": "A person in a security uniform"},
            {"prompt": "Is Rajesh the mastermind or a victim?", "options": ["Mastermind", "Victim", "Accomplice", "Unrelated"], "correct": "Victim"}
        ]
    },
    {
        "title": "Midnight Hit-and-Run",
        "slug": "midnight-hit-and-run",
        "story": "At 11:45 PM, a pedestrian was hit on a dimly lit road. The driver fled the scene immediately. The victim is in critical condition and cannot testify.\n\nA nearby CCTV camera captured the incident, but the footage is grainy due to heavy rain. The car appeared to be a dark-colored sedan, but the license plate was completely unreadable in the video. Police found a few broken pieces of plastic at the scene, likely from the vehicle's headlight assembly.",
        "evidence": "📹 CCTV Footage\n- Time of impact: 11:46 PM\n- Vehicle: Dark-colored sedan (black or navy blue)\n- License plate: Unreadable due to rain glare\n- Direction: Fled northbound towards Highway 9\n\n🚗 Physical Evidence at Scene\n- Broken transparent plastic piece (identified as part of a 2018-2021 model headlight)\n- Traces of navy blue paint scraped onto the victim's bicycle\n- Skid marks indicating sudden braking before impact\n\n📡 Cell Tower Data\n- 3 mobile numbers pinged the nearest tower traveling northbound at 11:47 PM\n- Number A: Registered to a local delivery truck\n- Number B: Registered to a navy blue 2019 sedan owner (Mr. Sharma)\n- Number C: Registered to a silver hatchback",
        "final_verdict_question": "Who was driving the vehicle that caused the hit-and-run?",
        "questions": [
            {"prompt": "What time did the impact occur according to CCTV?", "options": ["11:30 PM", "11:45 PM", "11:46 PM", "Midnight"], "correct": "11:46 PM"},
            {"prompt": "What color was the car involved in the incident?", "options": ["Black", "Silver", "Red", "Navy blue (based on paint transfer)"], "correct": "Navy blue (based on paint transfer)"},
            {"prompt": "What critical physical evidence was left at the scene?", "options": ["A side mirror", "A broken headlight piece", "A license plate", "A hubcap"], "correct": "A broken headlight piece"},
            {"prompt": "What type of vehicle does the broken plastic belong to?", "options": ["A 2015 SUV", "A 2018-2021 model sedan", "A commercial truck", "A motorcycle"], "correct": "A 2018-2021 model sedan"},
            {"prompt": "Which direction did the vehicle flee?", "options": ["Southbound", "Eastbound", "Northbound towards Highway 9", "Westbound"], "correct": "Northbound towards Highway 9"},
            {"prompt": "How many cell phones pinged the tower traveling in that direction right after the crash?", "options": ["1", "2", "3", "4"], "correct": "3"},
            {"prompt": "Which cell phone owner matches the vehicle description?", "options": ["Number A", "Number B (Mr. Sharma)", "Number C", "None"], "correct": "Number B (Mr. Sharma)"},
            {"prompt": "Why was the license plate unreadable in the CCTV footage?", "options": ["The car had no plates", "Rain glare", "Camera was broken", "Car was moving too fast"], "correct": "Rain glare"},
            {"prompt": "Did the driver attempt to stop before hitting the victim?", "options": ["Yes, there were skid marks", "No, they accelerated", "Yes, they honked", "Cannot be determined"], "correct": "Yes, there were skid marks"},
            {"prompt": "Based on the evidence, who is the prime suspect?", "options": ["The delivery truck driver", "Mr. Sharma", "The silver hatchback owner", "An unknown person"], "correct": "Mr. Sharma"}
        ]
    },
    {
        "title": "The Silicon Sabotage",
        "slug": "silicon-sabotage",
        "story": "Tech startup 'NexGen AI' was supposed to launch their revolutionary algorithm on Friday. But on Thursday morning, their entire codebase was leaked to a public repository online, destroying their competitive advantage and costing millions in valuation.\n\nThe leak originated from inside the company network. Only four senior developers had access to the master branch. The CEO suspects corporate espionage, but the CTO thinks it was a disgruntled employee seeking revenge for recent bonus cuts.",
        "evidence": "💻 Server Logs\n- Master branch was downloaded at 3:15 AM on Thursday.\n- Download was initiated using the credentials of 'Dev_Alice'.\n- IP address of download: 192.168.1.105 (Internal Office IP).\n\n🏢 Office Access Logs\n- Building is locked from 10 PM to 6 AM. Only security is present.\n- No employee badges were swiped during the night.\n\n🌐 Network Forensics\n- A VPN connection to the internal network was established at 3:10 AM.\n- The VPN authenticated using 'Dev_Bob's credentials.\n- The leaked code was uploaded to GitHub at 3:30 AM from an IP in Eastern Europe.\n\n📱 Employee Devices\n- Alice's laptop: Was offline at her home all night.\n- Bob's laptop: Shows a history of VPN logins at odd hours, but Bob claims he was asleep.\n- Charlie's laptop: Found a script designed to automate VPN login and large file transfers, last modified Wednesday afternoon.",
        "final_verdict_question": "Who executed the codebase leak?",
        "questions": [
            {"prompt": "When was the master branch downloaded?", "options": ["Wednesday afternoon", "Thursday at 3:15 AM", "Friday morning", "Thursday at 10:00 PM"], "correct": "Thursday at 3:15 AM"},
            {"prompt": "Whose credentials were used to actually download the code?", "options": ["Alice", "Bob", "Charlie", "Dave"], "correct": "Alice"},
            {"prompt": "Was anyone physically in the office at the time of the download?", "options": ["Yes, all developers", "Yes, Alice", "No, only security", "No one at all"], "correct": "No, only security"},
            {"prompt": "How did the attacker access the internal network?", "options": ["They broke into the office", "Through a VPN connection", "They hacked the firewall", "They used public WiFi"], "correct": "Through a VPN connection"},
            {"prompt": "Whose credentials were used to establish the VPN connection?", "options": ["Alice", "Bob", "Charlie", "Dave"], "correct": "Bob"},
            {"prompt": "Where was the code uploaded from?", "options": ["The office IP", "Bob's house", "An IP in Eastern Europe", "A local coffee shop"], "correct": "An IP in Eastern Europe"},
            {"prompt": "What alibi does Alice's laptop provide?", "options": ["It was logged into the VPN", "It was offline at her home all night", "It was formatting a drive", "It was in the office"], "correct": "It was offline at her home all night"},
            {"prompt": "What suspicious item was found on Charlie's laptop?", "options": ["The leaked code", "A VPN automation and file transfer script", "Emails to a competitor", "Bob's passwords"], "correct": "A VPN automation and file transfer script"},
            {"prompt": "Why did the attacker likely use two different sets of credentials (VPN vs Download)?", "options": ["To confuse investigators and frame others", "Because one account didn't work", "By mistake", "To double the download speed"], "correct": "To confuse investigators and frame others"},
            {"prompt": "Based on the digital footprint, who prepared the automated attack?", "options": ["Alice", "Bob", "Charlie", "An external hacker"], "correct": "Charlie"}
        ]
    },
    {
        "title": "The Poisoned Chalice",
        "slug": "poisoned-chalice",
        "story": "Wealthy businessman Arthur Pendelton collapsed during a private dinner party at his mansion. He was rushed to the hospital but was pronounced dead on arrival. The toxicology report confirmed he was poisoned with a rare, fast-acting toxin that causes cardiac arrest within 30 minutes of ingestion.\n\nOnly five people were at the table: his wife (Eleanor), his business partner (Victor), his lawyer (Mr. Finch), the chef (Henri), and Arthur himself. The poison had to be administered during the dinner.",
        "evidence": "🍽️ The Meal\n- Course 1: Soup (Everyone ate the same soup from a communal tureen)\n- Course 2: Steak (Individually plated in the kitchen by Chef Henri)\n- Drinks: Wine (Poured by Victor from a single bottle for everyone)\n- Dessert: Cake (Arthur didn't eat his, but collapsed shortly after it was served)\n\n🧪 Toxicology Results\n- Toxin found in Arthur's blood.\n- Trace amounts of toxin found ONLY in Arthur's wine glass.\n- The wine bottle itself was clean. No other guests were poisoned.\n\n🔍 Scene Investigation\n- Arthur's wine glass was located at the head of the table.\n- Eleanor sat to his left, Victor to his right.\n- During the steak course, Arthur dropped his napkin and bent under the table for about 10 seconds.\n- While Arthur was under the table, Mr. Finch was arguing with Chef Henri at the kitchen door.\n\n💼 Motives\n- Eleanor: Recently discovered Arthur was filing for divorce.\n- Victor: Secretly embezzled funds; Arthur was ordering an audit.\n- Mr. Finch: Sole executor of the estate, stands to gain a massive fee.\n- Chef Henri: Fired by Arthur that morning, working his final shift.",
        "final_verdict_question": "Who slipped the poison into Arthur's wine glass?",
        "questions": [
            {"prompt": "What type of poison killed Arthur?", "options": ["A slow-acting arsenic", "A fast-acting toxin causing cardiac arrest", "Cyanide in the food", "A venomous snake bite"], "correct": "A fast-acting toxin causing cardiac arrest"},
            {"prompt": "How long does the toxin take to cause cardiac arrest?", "options": ["5 minutes", "Within 30 minutes", "1 hour", "24 hours"], "correct": "Within 30 minutes"},
            {"prompt": "Where was the toxin physically found?", "options": ["In the soup", "In the steak", "In the wine bottle", "ONLY in Arthur's wine glass"], "correct": "ONLY in Arthur's wine glass"},
            {"prompt": "Since the wine bottle was clean, what does that mean?", "options": ["The wine manufacturer poisoned it", "The poison was added directly to Arthur's glass", "Victor poisoned the whole bottle", "The glass was poisoned days ago"], "correct": "The poison was added directly to Arthur's glass"},
            {"prompt": "When did Arthur leave his glass unattended and unobserved by himself?", "options": ["When he went to the restroom", "When he dropped his napkin and bent under the table", "When he went to the kitchen", "He never left it unattended"], "correct": "When he dropped his napkin and bent under the table"},
            {"prompt": "Who was sitting immediately next to Arthur?", "options": ["Only Eleanor", "Only Victor", "Eleanor and Victor", "Mr. Finch and Chef Henri"], "correct": "Eleanor and Victor"},
            {"prompt": "Where were Mr. Finch and Chef Henri when Arthur bent under the table?", "options": ["Sitting next to him", "Arguing at the kitchen door", "Pouring wine", "In the garden"], "correct": "Arguing at the kitchen door"},
            {"prompt": "Who poured the wine initially?", "options": ["Chef Henri", "Victor", "Eleanor", "Arthur"], "correct": "Victor"},
            {"prompt": "Why is Chef Henri an unlikely suspect for putting poison in the glass?", "options": ["He wasn't at the table during the opportunity", "He loved Arthur", "He didn't have access to the dining room", "He only cooked vegan food"], "correct": "He wasn't at the table during the opportunity"},
            {"prompt": "Given proximity and opportunity when Arthur was distracted, who had the easiest chance to poison the glass?", "options": ["Eleanor or Victor", "Mr. Finch", "Chef Henri", "The Butler"], "correct": "Eleanor or Victor"}
        ]
    }
]

with app.app_context():
    # Clear existing cases and questions
    Question.query.delete()
    CaseFile.query.delete()
    db.session.commit()
    print("Cleared old cases.")

    # Add new cases
    for data in cases_data:
        c = CaseFile(
            title=data["title"],
            slug=data["slug"],
            story=data["story"],
            evidence=data["evidence"],
            final_verdict_question=data["final_verdict_question"],
            is_paid=False,
            price_inr=0,
            is_published=True
        )
        db.session.add(c)
        db.session.flush() # Get the ID
        
        for q_data in data["questions"]:
            q = Question(
                case_id=c.id,
                prompt=q_data["prompt"],
                options_json=json.dumps(q_data["options"]),
                correct_answer=q_data["correct"],
                explanation="Correct answer: " + q_data["correct"]
            )
            db.session.add(q)
            
    db.session.commit()
    print("Successfully seeded 4 comprehensive cases with 10 questions each!")
