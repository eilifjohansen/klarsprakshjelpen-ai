import {useState} from 'react'
import {BodyLong, Button, Checkbox, CheckboxGroup, Heading, Link, Modal, Textarea, TextField} from "@navikt/ds-react";
import {Privacy} from "./index";

function Gpt(props: {
    userid: any;
    mySnippet: any; }) {
    const unique_id = props.userid;
    let mySnippet = props.mySnippet;
    let higlighetdwordsModifiedAppertium = mySnippet.replaceAll("\n", "%0A%0A");
    higlighetdwordsModifiedAppertium = higlighetdwordsModifiedAppertium.replaceAll("%0A%0A%0A%0A", "%0A%0A");

    const [prompt, setPrompt] = useState("Skriv teksten på klarspråk. Husk å bruke enkle og forståelige ord og uttrykk. Legg til avsnitt der det er naturlig.");
    const [apikey, setApikey] = useState("");
    const [harGodtatt, setHarGodtatt] = useState("");
    const [loading, setLoading] = useState(false);
    const [harSpørsmål, setHarSprørsmål] = useState(0);
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const handleTranslate = async () => {
        setLoading(true)
        try {
            const apiUrl = 'https://api.openai.com/v1/completions';
            const apiKey = apikey;
            console.log("Send")
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: "text-davinci-003",
                    prompt: prompt + ": " + mySnippet,
                    max_tokens: 2048,
                    temperature: 1,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                    user: unique_id
                }),
            });
            setLoading(true)
            console.log("Start")
            const data = await response.json();
            setTranslatedText(data.choices[0].text.trim());
            setResponse(data.choices[0].text.trim());
            setHarGodtatt("yes")
            console.log("Slutt")
        } catch (error) {
            console.error('Error:', error);
            setHarGodtatt("yes")
        }
    };


    // @ts-ignore
    const handleChange = (val: any[]) => setHarSprørsmål(val);
    const [harSamtykket, setHarSamtykket] = useState(false)
    const handleChangeSamtykke = (val: any[]) => console.log(val);
    const [state, setState] = useState([]);
    const [translatedText, setTranslatedText] = useState('');
    const [opengpt, setOpengpt] = useState(false);

    const handleChangeApikey = (event) => {
        setApikey(event.target.value);
    }

    const handleChangePrompt = (event) => {
        setPrompt(event.target.value);
    }

    function gptmodal() {
        event.preventDefault()
        setOpengpt(true)
    }

    function avbryt() {
        setOpengpt(false)
        setHarGodtatt("")
        setHarSprørsmål(0)
        setState(["samtykke"]);
        setTranslatedText("")
    }

    function generer() {
        handleTranslate()
        setState(["samtykke"]);
    }

    function closemodal() {
        setOpengpt((x) => !x)
        setHarGodtatt("")
        setHarSprørsmål(0)
        setTranslatedText("")
    }

    return (
        <>
            <button onClick={() => gptmodal()}
                    className="navds-button navds-button--secondary navds-button--small navds-label--small språkhjelp-nounderline"
                    style={{textDecoration: "none"}}>Tilpass tekst
            </button>
            <Modal
                open={opengpt}
                aria-label="Modal demo"
                onClose={() => closemodal()}
                aria-labelledby="modal-heading"
                style={{minWidth: "300px"}}
            >
                <Modal.Content>
                    {harGodtatt == "" && (
                        <><Heading spacing level="1" size="medium" id="modal-heading">
                            Tilpass tekst
                        </Heading>

                            Vi bruker <Link href="https://no.wikipedia.org/wiki/OpenAI"
                                            target="_blank">OpenAI</Link> til å tilpasse teksten.
                            <br/><br/>
                            <Textarea maxRows={5} label="Tekst som sendes til OpenAI" value={mySnippet}
                            />
                            <br/>
                            <div className="språkhjelp-mb-4">
                                <Privacy content={mySnippet}/>
                            </div>
                            <CheckboxGroup
                                className="språkhjelp-remove-accordion-padding-bottom"
                                legend="Velg de som passer"
                                onChange={(v) => setState(v)}
                                value={state}
                            >
                                <Checkbox value="ingen-personinfo">Teksten inneholder ingen
                                    personopplysninger</Checkbox>
                                <Checkbox value="samtykke">Jeg godtar at OpenAI tilpasser teksten</Checkbox>
                            </CheckboxGroup>
                            <br/>
                            <TextField type="password" label="OpenAI API-nøkkel" value={apikey}
                                       onChange={handleChangeApikey}/>
                            <br/>
                            <Textarea label="Prompt" value={prompt}
                                      onChange={handleChangePrompt}/>
                            <br/>
                            <Button className="språkhjelp-mr-2" onClick={() => avbryt()}
                                    variant="tertiary">Avbryt</Button>
                            {state.length != 2 ? (
                                <Button disabled>Neste</Button>
                            ) : (
                                <>
                                    {!loading && (<Button onClick={() => generer()}>Neste</Button>)}
                                    {loading == true && (<Button onClick={() => generer()}>Neste</Button>)}
                                </>
                            )}
                        </>
                    )}

                    {harGodtatt != "" && (
                        <>
                            <Heading spacing level="1" size="medium" id="modal-heading">
                                Tilpasset tekst
                            </Heading>
                            <BodyLong style={{whiteSpace: "break-spaces"}}>
                                {translatedText ? (
                                    <>{translatedText}</>) : (<>Beklager, prøv igjen senere. OpenAI er overbelastet.</>
                                )}
                            </BodyLong>
                            <br/>
                            <Button className="språkhjelp-mr-2" onClick={() => avbryt()} variant="primary">Lukk</Button>
                        </>
                    )}

                </Modal.Content>
            </Modal>
        </>
    )
}

export default Gpt;