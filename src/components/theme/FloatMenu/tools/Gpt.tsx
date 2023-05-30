import {useState} from 'react'
import {BodyLong, Button, Checkbox, CheckboxGroup, Heading, Link, Modal, Textarea, TextField} from "@navikt/ds-react";
import {Privacy} from "./index";

function Gpt(props: { content: any; }) {
    let open = props.open;
    let mySnippet = props.mySnippet;
    const [prompt, setPrompt] = useState("Jeg som ukrainsk bestemor på 77 år trenger hjelp til å forstå det norske systemet,\n" +
        "kan du som klarspråkspesialist, som tidligere har vært i samme situasjon hjelpe meg til å forstå denne teksten")
    const [apikey, setApikey] = useState("")
    const [harGodtatt, setHarGodtatt] = useState("")

    let higlighetdwordsModifiedAppertium = mySnippet.replaceAll("\n", "%0A%0A");
    higlighetdwordsModifiedAppertium = higlighetdwordsModifiedAppertium.replaceAll("%0A%0A%0A%0A", "%0A%0A");

    const [harSpørsmål, setHarSprørsmål] = useState(0)

    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const handleTranslate = async () => {
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
                    presence_penalty: 0
                }),
            });


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

    const handleChangeApikey = (event) => {
        setApikey(event.target.value);
    }

    const handleChangePrompt = (event) => {
        setPrompt(event.target.value);
    }

    function avbryt() {
        setOpenbox(false)
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
        setOpenbox((x) => !x)
        setHarGodtatt("")
        setHarSprørsmål(0)
        setTranslatedText("")
    }

/*    async function handleTranslate() {
        try {
            const response = await fetch("https://www.apertium.org/apy/translate?q=" + higlighetdwordsModifiedAppertium + "&langpair=nob|nn");
            const data = await response.json();
            setTranslatedText(data.responseData.translatedText);
            if (data.responseData) {
                setTranslatedText(data.responseData.translatedText);
                setHarGodtatt("yes")
            } else {
                setTranslatedText("En feil oppstod. Prøv igjen på et senere tidspunkt.");
                setHarGodtatt("yes")
            }
        } catch (error) {
            setTranslatedText("En feil oppstod. Prøv igjen på et senere tidspunkt.");
            setHarGodtatt("yes")
        }
    }*/

    return (
        <Modal
            open={open}
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

                        Vi bruker <Link href="https://wiki.Gpt.org/wiki/Gpt"
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
                            <Checkbox value="samtykke">Jeg godtar at OpenAI får tilgang til teksten</Checkbox>
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
                            <Button onClick={() => generer()}>Neste</Button>
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
                  {/*        <ReadMore className="språkhjelp-mt-4" header="Vis orginal tekst">
                                {translatedText}
                            </ReadMore>*/}
                        <br/>
                        <Button className="språkhjelp-mr-2" onClick={() => avbryt()} variant="primary">Lukk</Button>
                    </>
                )}

            </Modal.Content>
        </Modal>
    )
}

export default Gpt;