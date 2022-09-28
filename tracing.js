const opentelemetry = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const sdk = new opentelemetry.NodeSDK({
  // traceExporter: new opentelemetry.tracing.ConsoleSpanExporter(),
  traceExporter: new ZipkinExporter({
    serviceName: "Hello",
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
