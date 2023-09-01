const sdkToken = ''; //put your token here
const sentryDsn = '';

const { DocumentDetectorSdk: Sdk } = this['@combateafraude/document-detector'];
const sdkContainer = document.getElementById('sdk-displayer');
const buttonSdkStart = document.getElementById('sdk-start');

buttonSdkStart.disabled = false;
buttonSdkStart.addEventListener('click', runSdk);

const sdk = new Sdk({
    token: sdkToken,
    environment: "dev", //dev, beta or prod
    language: "pt_BR",
    analyticsSettings: {
        disableAnalytics: false,
        trackingId: undefined,
        trackingInfo: undefined,
        sentryDataSourceName: sentryDsn,
    },
    environmentSettings: {
        disableDesktopExecution: false,
    },
    appearenceSettings: {
        captureButtonIcon: '',
        captureIconSize: '',
        captureButtonColor: '',
        switchButtonIcon: '',
        switchIconSize: '',
        switchIconColor: '',
        fontFamily: '',
    },
    capturerSettings: {
        disableAdvancedCapturing: false,
    },
    uploadSettings: {
        /* enabled: true, */
        appearenceSettings: {
            backgroundColor: '',
            cardColor: '',
            allowButtonColor: '',
            tryAgainButtonColor: '',
        },
    },
    textSettings: {
        messages: {
            processMessage: '',
            wrongDocumentMessage: '',
            bothWrongSideMessage: '',
            wrongSideMessage: '',
            lowQualityMessage: '',
            captureFailedMessage: '',
        },
        uploadMessages: {
            allowAcessTitle: '',
            allowAcessMessage: '',
            allowAcessButton: '',
            invalidFormatTitle: '',
            invalidFormatMessage: '',
            tryAgainButton: '',
            sendFileTitle: '',
            errorTitle: '',
            errorMessage: '',
            successTitle: '',
        }
    }
});

sdk.addEventListener('front_capture_started', () => {
    console.debug('Evento de captura da frente disparado');
});

sdk.addEventListener('back_capture_started', () => {
    console.debug('Evento de captura do verso disparado');
});

const sdkInitializationPromise = sdk.initialize();

async function runSdk() {
    buttonSdkStart.disabled = true;
    buttonSdkStart.textContent = 'Iniciando';

    const captureMode = document.getElementById('capture-type').value;
    const documentType = document.getElementById('document-type').value;
    const documentSide = document.getElementById('document-side').value;
    const issuedCountry = document.getElementById('issued-country').value;

    console.log("captureMode: ", captureMode);
    console.log("documentType: ", documentType);
    console.log("documentSide: ", documentSide);
    console.log("issuedCountry", issuedCountry);

    try {
        await sdk.initPermissions();
        await sdkInitializationPromise;

        const stages =[{mode: captureMode, attempts: 5, duration: 0}, {mode: 'manual', attempts: 1, duration: 105000}, {mode: 'automatic', attempts: 2, duration: 80000}];

        const captureSettings = { mode: captureMode, automaticCaptureTimeoutInSeconds: 0 };
        const result = await sdk.capture(sdkContainer, stages, {documentType ,documentSide, captureSettings, issuedCountry});
        console.log('Capture finished', result);

        //await sdk.dispose();
    }
    catch (error) {
        console.error(error);
    }

    buttonSdkStart.disabled = false;
    buttonSdkStart.textContent = 'Iniciar SDK';
}
