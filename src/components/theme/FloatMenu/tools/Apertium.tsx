import {useState} from 'react'
import {BodyLong, Button, Checkbox, CheckboxGroup, Heading, Link, Modal, Textarea} from "@navikt/ds-react";
import {Privacy} from "./index";

function Apertium(props: { mySnippet: any; }) {
    let mySnippet = props.mySnippet;
    let higlighetdwordsModifiedAppertium = mySnippet.replaceAll("\n", "%0A%0A");
    higlighetdwordsModifiedAppertium = higlighetdwordsModifiedAppertium.replaceAll("%0A%0A%0A%0A", "%0A%0A");

    // @ts-ignore
    const handleChange = (val: any[]) => setHarSprørsmål(val);
    const [openapertium, setOpenapertium] = useState(false);
    const [harSpørsmål, setHarSprørsmål] = useState(0)
    const [harSamtykket, setHarSamtykket] = useState(false)
    const [harGodtatt, setHarGodtatt] = useState("")
    const handleChangeSamtykke = (val: any[]) => console.log(val);
    const [state, setState] = useState([]);
    const [translatedText, setTranslatedText] = useState('');

    function apertiummodal() {
        event.preventDefault()
        setOpenapertium(true)
    }

    const handleChangeSnippet = (event) => {
        mySnippet(event.target.value);
    }

    function avbryt() {
        setOpenapertium(false)
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
        setOpenapertium((x) => !x)
        setHarGodtatt("")
        setHarSprørsmål(0)
        setTranslatedText("")
    }

    async function handleTranslate() {
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
    }

    return (
        <>
            <button onClick={() => apertiummodal()}
                    className="navds-button navds-button--secondary navds-button--small navds-label--small språkhjelp-nounderline"
                    style={{textDecoration: "none"}}>Oversett
            </button>
            <Modal
                open={openapertium}
                aria-label="Modal demo"
                onClose={() => closemodal()}
                aria-labelledby="modal-heading"
                style={{minWidth: "300px"}}
            >
                <Modal.Content>
                    {harGodtatt == "" && (
                        <>                    <Heading spacing level="1" size="medium" id="modal-heading">
                            Oversett til nynorsk
                        </Heading>

                            Vi bruker <Link href="https://wiki.apertium.org/wiki/Apertium"
                                            target="_blank">Apertium</Link> til å oversette teksten.
                            <br/><br/>
                            <Textarea maxRows={5} label="Tekst som sendes til Apertium" value={mySnippet}
                                      onChange={handleChangeSnippet}/>
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
                                <Checkbox value="samtykke">Jeg godtar at Apertium oversetter teksten</Checkbox>
                            </CheckboxGroup>
                            <br/>
                            <Button className="språkhjelp-mr-2" onClick={() => avbryt()}
                                    variant="tertiary">Avbryt</Button>
                            {state.length != 2 ? (
                                <Button disabled>Oversett</Button>
                            ) : (
                                <Button onClick={() => generer()}>Oversett</Button>
                            )}
                        </>
                    )}

                    {harGodtatt != "" && (
                        <>
                            <Heading spacing level="1" size="medium" id="modal-heading">
                                Nynorsk oversettelse
                            </Heading>
                            <BodyLong style={{whiteSpace: "break-spaces"}}>
                                {translatedText ? (
                                    <>"{translatedText}" - Apertium</>) : (<>En feil oppstod. Prøv igjen på et senere
                                        tidspunkt.</>
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

export default Apertium;