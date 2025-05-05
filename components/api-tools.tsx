"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check, Play, Plus, Trash } from "lucide-react";

export function ApiTools() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ApiTester />
      <CurlGenerator />
      <HttpStatusCodeChecker />
      <GraphQLPlayground />
      <UserAgentParser />
      <HeaderViewer />
    </div>
  );
}

function ApiTester() {
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/todos/1");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: "Content-Type", value: "application/json" },
  ]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const sendRequest = async () => {
    setLoading(true);
    setResponse("");
    setStatus("");

    try {
      const headerObj: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key.trim() !== "") {
          headerObj[h.key] = h.value;
        }
      });

      const options: RequestInit = {
        method,
        headers: headerObj,
      };

      // Handle JSON parsing if Content-Type is application/json
      if (method !== "GET" && method !== "HEAD" && body.trim() !== "") {
        if (headerObj["Content-Type"] === "application/json") {
          try {
            options.body = JSON.stringify(JSON.parse(body));
          } catch {
            setResponse("Invalid JSON in request body.");
            setStatus("Client Error");
            setLoading(false);
            return;
          }
        } else {
          options.body = body;
        }
      }

      const res = await fetch(url, options);
      const text = await res.text();

      try {
        const json = JSON.parse(text);
        setResponse(JSON.stringify(json, null, 2));
      } catch {
        setResponse(text);
      }

      setStatus(`${res.status} ${res.statusText}`);
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : String(error)}`);
      setStatus("Error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>API Tester</CardTitle>
        <CardDescription>
          Test API endpoints with different methods and parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="HEAD">HEAD</SelectItem>
                <SelectItem value="OPTIONS">OPTIONS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-3/4">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter API URL"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Headers</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={addHeader}
              className="h-8 px-2"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Header
            </Button>
          </div>

          {headers.map((header, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={header.key}
                onChange={(e) => updateHeader(index, "key", e.target.value)}
                placeholder="Header name"
                className="w-1/3"
              />
              <Input
                value={header.value}
                onChange={(e) => updateHeader(index, "value", e.target.value)}
                placeholder="Value"
                className="w-2/3"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeHeader(index)}
                className="px-2"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {(method === "POST" || method === "PUT" || method === "PATCH") && (
          <div className="space-y-2">
            <Label>Request Body</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter request body (JSON, form data, etc.)"
              className="min-h-[100px] font-mono text-sm"
            />
          </div>
        )}

        <Button onClick={sendRequest} className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Request"}
          {!loading && <Play className="ml-2 h-4 w-4" />}
        </Button>

        {status && (
          <div
            className={`text-sm font-medium ${
              status.startsWith("2")
                ? "text-green-600"
                : status.startsWith("4") ||
                  status.startsWith("5") ||
                  status === "Error"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            Status: {status}
          </div>
        )}

        {response && (
          <div className="relative">
            <Label>Response</Label>
            <Textarea
              value={response}
              readOnly
              className="min-h-[200px] font-mono text-sm mt-2"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-8 right-2"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


function CurlGenerator() {
  const [url, setUrl] = useState("https://api.example.com/data");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: "Content-Type", value: "application/json" },
  ]);
  const [body, setBody] = useState('{\n  "key": "value"\n}');
  const [curlCommand, setCurlCommand] = useState("");
  const [copied, setCopied] = useState(false);

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  const updateHeader = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const generateCurl = () => {
    let command = `curl -X ${method} "${url}"`;

    headers.forEach((header) => {
      if (header.key.trim() !== "") {
        command += ` \\\n  -H "${header.key}: ${header.value}"`;
      }
    });

    if (
      (method === "POST" || method === "PUT" || method === "PATCH") &&
      body.trim() !== ""
    ) {
      command += ` \\\n  -d '${body.replace(/'/g, "\\'")}'`;
    }

    setCurlCommand(command);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>cURL Generator</CardTitle>
        <CardDescription>
          Generate cURL commands for API requests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/4">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="HEAD">HEAD</SelectItem>
                <SelectItem value="OPTIONS">OPTIONS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-3/4">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter API URL"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Headers</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={addHeader}
              className="h-8 px-2"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Header
            </Button>
          </div>

          {headers.map((header, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                value={header.key}
                onChange={(e) => updateHeader(index, "key", e.target.value)}
                placeholder="Header name"
                className="w-1/3"
              />
              <Input
                value={header.value}
                onChange={(e) => updateHeader(index, "value", e.target.value)}
                placeholder="Value"
                className="w-2/3"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeHeader(index)}
                className="px-2"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {(method === "POST" || method === "PUT" || method === "PATCH") && (
          <div className="space-y-2">
            <Label>Request Body</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter request body (JSON, form data, etc.)"
              className="min-h-[100px] font-mono text-sm"
            />
          </div>
        )}

        <Button onClick={generateCurl} className="w-full">
          Generate cURL Command
        </Button>

        {curlCommand && (
          <div className="relative">
            <Label>cURL Command</Label>
            <Textarea
              value={curlCommand}
              readOnly
              className="min-h-[150px] font-mono text-sm mt-2"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-8 right-2"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function HttpStatusCodeChecker() {
  const [statusCode, setStatusCode] = useState("200");
  const [statusInfo, setStatusInfo] = useState<{
    code: string;
    message: string;
    description: string;
    category: string;
  } | null>(null);

  const statusCodes: Record<
    string,
    { message: string; description: string; category: string }
  > = {
    // 1xx - Informational
    "100": {
      message: "Continue",
      description:
        "The server has received the request headers and the client should proceed to send the request body.",
      category: "Informational",
    },
    "101": {
      message: "Switching Protocols",
      description: "The requester has asked the server to switch protocols.",
      category: "Informational",
    },
    "102": {
      message: "Processing",
      description:
        "The server has received and is processing the request, but no response is available yet.",
      category: "Informational",
    },
    "103": {
      message: "Early Hints",
      description:
        "Used to return some response headers before final HTTP message.",
      category: "Informational",
    },

    // 2xx - Success
    "200": {
      message: "OK",
      description:
        "The request has succeeded. The information returned depends on the method used in the request.",
      category: "Success",
    },
    "201": {
      message: "Created",
      description:
        "The request has been fulfilled and resulted in a new resource being created.",
      category: "Success",
    },
    "202": {
      message: "Accepted",
      description:
        "The request has been accepted for processing, but the processing has not been completed.",
      category: "Success",
    },
    "203": {
      message: "Non-Authoritative Information",
      description:
        "The request was successful but the enclosed payload has been modified from that of the origin server.",
      category: "Success",
    },
    "204": {
      message: "No Content",
      description:
        "The server has successfully processed the request and is not returning any content.",
      category: "Success",
    },
    "205": {
      message: "Reset Content",
      description:
        "The server successfully processed the request, asks that the requester reset its document view.",
      category: "Success",
    },
    "206": {
      message: "Partial Content",
      description:
        "The server is delivering only part of the resource due to a range header sent by the client.",
      category: "Success",
    },
    "207": {
      message: "Multi-Status",
      description:
        "Provides status for multiple independent operations (WebDAV).",
      category: "Success",
    },
    "208": {
      message: "Already Reported",
      description:
        "Members of a DAV binding have already been enumerated (WebDAV).",
      category: "Success",
    },
    "226": {
      message: "IM Used",
      description:
        "The server has fulfilled a request for the resource, and the response is a representation of the result.",
      category: "Success",
    },

    // 3xx - Redirection
    "300": {
      message: "Multiple Choices",
      description:
        "Indicates multiple options for the resource from which the client may choose.",
      category: "Redirection",
    },
    "301": {
      message: "Moved Permanently",
      description:
        "The requested resource has been permanently moved to a new URI.",
      category: "Redirection",
    },
    "302": {
      message: "Found",
      description:
        "The requested resource resides temporarily under a different URI.",
      category: "Redirection",
    },
    "303": {
      message: "See Other",
      description:
        "The response to the request can be found under another URI using a GET method.",
      category: "Redirection",
    },
    "304": {
      message: "Not Modified",
      description:
        "Indicates that the resource has not been modified since the last request.",
      category: "Redirection",
    },
    "305": {
      message: "Use Proxy",
      description:
        "The requested resource must be accessed through the proxy given by the Location field.",
      category: "Redirection",
    },
    "306": {
      message: "Switch Proxy",
      description: "No longer used. Reserved for future use.",
      category: "Redirection",
    },
    "307": {
      message: "Temporary Redirect",
      description:
        "The request should be repeated with another URI; future requests should still use the original URI.",
      category: "Redirection",
    },
    "308": {
      message: "Permanent Redirect",
      description:
        "The request and all future requests should be repeated using another URI.",
      category: "Redirection",
    },

    // 4xx - Client Error
    "400": {
      message: "Bad Request",
      description:
        "The server cannot process the request due to client error (e.g., malformed syntax).",
      category: "Client Error",
    },
    "401": {
      message: "Unauthorized",
      description:
        "Authentication is required and has failed or has not yet been provided.",
      category: "Client Error",
    },
    "402": {
      message: "Payment Required",
      description:
        "Reserved for future use. Initially for digital payment systems.",
      category: "Client Error",
    },
    "403": {
      message: "Forbidden",
      description:
        "The server understood the request but refuses to authorize it.",
      category: "Client Error",
    },
    "404": {
      message: "Not Found",
      description: "The requested resource could not be found on the server.",
      category: "Client Error",
    },
    "405": {
      message: "Method Not Allowed",
      description:
        "A request method is not supported for the requested resource.",
      category: "Client Error",
    },
    "406": {
      message: "Not Acceptable",
      description:
        "The requested resource is capable of generating only content not acceptable by the client.",
      category: "Client Error",
    },
    "407": {
      message: "Proxy Authentication Required",
      description: "Authentication with the proxy is required.",
      category: "Client Error",
    },
    "408": {
      message: "Request Timeout",
      description: "The server timed out waiting for the request.",
      category: "Client Error",
    },
    "409": {
      message: "Conflict",
      description:
        "The request could not be processed due to a conflict with the current state of the resource.",
      category: "Client Error",
    },
    "410": {
      message: "Gone",
      description:
        "The resource is no longer available and will not be available again.",
      category: "Client Error",
    },
    "411": {
      message: "Length Required",
      description:
        "The request did not specify the length of its content, which is required.",
      category: "Client Error",
    },
    "412": {
      message: "Precondition Failed",
      description:
        "One or more conditions in the request header fields evaluated to false.",
      category: "Client Error",
    },
    "413": {
      message: "Payload Too Large",
      description:
        "The request entity is larger than limits defined by server.",
      category: "Client Error",
    },
    "414": {
      message: "URI Too Long",
      description: "The URI provided was too long for the server to process.",
      category: "Client Error",
    },
    "415": {
      message: "Unsupported Media Type",
      description:
        "The media format of the requested data is not supported by the server.",
      category: "Client Error",
    },
    "416": {
      message: "Range Not Satisfiable",
      description:
        "The range specified by the Range header field in the request cannot be fulfilled.",
      category: "Client Error",
    },
    "417": {
      message: "Expectation Failed",
      description:
        "The server cannot meet the requirements of the Expect request-header field.",
      category: "Client Error",
    },
    "418": {
      message: "I'm a teapot",
      description:
        "April Fools' joke. The server refuses to brew coffee because it is a teapot.",
      category: "Client Error",
    },
    "421": {
      message: "Misdirected Request",
      description:
        "The request was directed at a server that is not able to produce a response.",
      category: "Client Error",
    },
    "422": {
      message: "Unprocessable Entity",
      description:
        "The request was well-formed but was unable to be followed due to semantic errors.",
      category: "Client Error",
    },
    "423": {
      message: "Locked",
      description: "The resource that is being accessed is locked.",
      category: "Client Error",
    },
    "424": {
      message: "Failed Dependency",
      description:
        "The request failed due to failure of a previous request (e.g., a PROPPATCH).",
      category: "Client Error",
    },
    "425": {
      message: "Too Early",
      description:
        "Indicates that the server is unwilling to risk processing a request that might be replayed.",
      category: "Client Error",
    },
    "426": {
      message: "Upgrade Required",
      description: "The client should switch to a different protocol.",
      category: "Client Error",
    },
    "428": {
      message: "Precondition Required",
      description: "The origin server requires the request to be conditional.",
      category: "Client Error",
    },
    "429": {
      message: "Too Many Requests",
      description:
        "The user has sent too many requests in a given amount of time.",
      category: "Client Error",
    },
    "431": {
      message: "Request Header Fields Too Large",
      description:
        "The server is unwilling to process the request because its header fields are too large.",
      category: "Client Error",
    },
    "451": {
      message: "Unavailable For Legal Reasons",
      description:
        "The user-agent requested a resource that cannot legally be provided.",
      category: "Client Error",
    },

    // 5xx - Server Error
    "500": {
      message: "Internal Server Error",
      description:
        "The server encountered an unexpected condition that prevented it from fulfilling the request.",
      category: "Server Error",
    },
    "501": {
      message: "Not Implemented",
      description:
        "The server does not support the functionality required to fulfill the request.",
      category: "Server Error",
    },
    "502": {
      message: "Bad Gateway",
      description:
        "The server received an invalid response from the upstream server.",
      category: "Server Error",
    },
    "503": {
      message: "Service Unavailable",
      description:
        "The server is currently unable to handle the request due to temporary overload or maintenance.",
      category: "Server Error",
    },
    "504": {
      message: "Gateway Timeout",
      description:
        "The server did not receive a timely response from the upstream server.",
      category: "Server Error",
    },
    "505": {
      message: "HTTP Version Not Supported",
      description:
        "The server does not support the HTTP protocol version used in the request.",
      category: "Server Error",
    },
    "506": {
      message: "Variant Also Negotiates",
      description:
        "Transparent content negotiation for the request results in a circular reference.",
      category: "Server Error",
    },
    "507": {
      message: "Insufficient Storage",
      description:
        "The server is unable to store the representation needed to complete the request (WebDAV).",
      category: "Server Error",
    },
    "508": {
      message: "Loop Detected",
      description:
        "The server detected an infinite loop while processing a request (WebDAV).",
      category: "Server Error",
    },
    "510": {
      message: "Not Extended",
      description:
        "Further extensions to the request are required for the server to fulfill it.",
      category: "Server Error",
    },
    "511": {
      message: "Network Authentication Required",
      description: "The client needs to authenticate to gain network access.",
      category: "Server Error",
    },
  };

  const checkStatusCode = () => {
    if (statusCodes[statusCode]) {
      setStatusInfo({
        code: statusCode,
        ...statusCodes[statusCode],
      });
    } else {
      setStatusInfo(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>HTTP Status Code Checker</CardTitle>
        <CardDescription>
          Look up HTTP status codes and their meanings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={statusCode}
            onChange={(e) => setStatusCode(e.target.value)}
            placeholder="Enter status code"
            className="w-full"
          />
          <Button onClick={checkStatusCode}>Check</Button>
        </div>

        {statusInfo ? (
          <div className="mt-4 space-y-2">
            <div
              className={`text-lg font-bold ${
                statusInfo.category === "Success"
                  ? "text-green-600"
                  : statusInfo.category === "Client Error" ||
                    statusInfo.category === "Server Error"
                  ? "text-red-600"
                  : statusInfo.category === "Redirection"
                  ? "text-yellow-600"
                  : "text-blue-600"
              }`}
            >
              {statusInfo.code} {statusInfo.message}
            </div>
            <div className="text-sm text-muted-foreground">
              Category: {statusInfo.category}
            </div>
            <div className="text-sm mt-2">{statusInfo.description}</div>
          </div>
        ) : statusCode ? (
          <div className="mt-4 text-sm text-red-600">
            Status code not found. Please enter a valid HTTP status code.
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function GraphQLPlayground() {
  const [endpoint, setEndpoint] = useState("https://graphql-demo.mead.io/");
  const [query, setQuery] = useState(`query {
  hello
}`);
  const [variables, setVariables] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const executeQuery = async () => {
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: variables ? JSON.parse(variables) : undefined,
        }),
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>GraphQL Playground</CardTitle>
        <CardDescription>Test GraphQL queries and mutations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>GraphQL Endpoint</Label>
          <Input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="Enter GraphQL endpoint URL"
          />
        </div>

        <div className="space-y-2">
          <Label>Query</Label>
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your GraphQL query"
            className="min-h-[150px] font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label>Variables (JSON)</Label>
          <Textarea
            value={variables}
            onChange={(e) => setVariables(e.target.value)}
            placeholder="Enter variables as JSON (optional)"
            className="min-h-[80px] font-mono text-sm"
          />
        </div>

        <Button onClick={executeQuery} className="w-full" disabled={loading}>
          {loading ? "Executing..." : "Execute Query"}
          {!loading && <Play className="ml-2 h-4 w-4" />}
        </Button>

        {response && (
          <div className="relative">
            <Label>Response</Label>
            <Textarea
              value={response}
              readOnly
              className="min-h-[200px] font-mono text-sm mt-2"
            />
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-8 right-2"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function UserAgentParser() {
  const [userAgent, setUserAgent] = useState("");
  const [parsedInfo, setParsedInfo] = useState<null | {
    browser: { name: string; version: string };
    os: { name: string; version: string };
    device: { type: string; brand: string; model: string };
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
  }>(null);

  const parseUserAgent = () => {
    // Use current browser's user agent if empty
    const uaString = userAgent.trim() || navigator.userAgent;

    try {
      // Simple parsing logic - in a real app you might use a library like ua-parser-js
      const ua = uaString.toLowerCase();

      // Browser detection
      let browser = { name: "Unknown", version: "" };
      if (ua.includes("firefox")) {
        browser.name = "Firefox";
        const match = ua.match(/firefox\/([\d.]+)/);
        if (match) browser.version = match[1];
      } else if (ua.includes("edg")) {
        browser.name = "Edge";
        const match = ua.match(/edg\/([\d.]+)/);
        if (match) browser.version = match[1];
      } else if (ua.includes("chrome")) {
        browser.name = "Chrome";
        const match = ua.match(/chrome\/([\d.]+)/);
        if (match) browser.version = match[1];
      } else if (ua.includes("safari") && !ua.includes("chrome")) {
        browser.name = "Safari";
        const match = ua.match(/version\/([\d.]+)/);
        if (match) browser.version = match[1];
      } else if (ua.includes("msie") || ua.includes("trident")) {
        browser.name = "Internet Explorer";
        const match = ua.match(/(?:msie |rv:)([\d.]+)/);
        if (match) browser.version = match[1];
      }

      // OS detection
      let os = { name: "Unknown", version: "" };
      if (ua.includes("windows")) {
        os.name = "Windows";
        if (ua.includes("windows nt 10")) os.version = "10";
        else if (ua.includes("windows nt 6.3")) os.version = "8.1";
        else if (ua.includes("windows nt 6.2")) os.version = "8";
        else if (ua.includes("windows nt 6.1")) os.version = "7";
        else if (ua.includes("windows nt 6.0")) os.version = "Vista";
        else if (ua.includes("windows nt 5.1")) os.version = "XP";
      } else if (ua.includes("macintosh") || ua.includes("mac os x")) {
        os.name = "macOS";
        const match = ua.match(/mac os x ([\d_.]+)/);
        if (match) os.version = match[1].replace(/_/g, ".");
      } else if (ua.includes("android")) {
        os.name = "Android";
        const match = ua.match(/android ([\d.]+)/);
        if (match) os.version = match[1];
      } else if (
        ua.includes("ios") ||
        ua.includes("iphone") ||
        ua.includes("ipad")
      ) {
        os.name = "iOS";
        const match = ua.match(/os ([\d_]+)/);
        if (match) os.version = match[1].replace(/_/g, ".");
      } else if (ua.includes("linux")) {
        os.name = "Linux";
      }

      // Device detection
      const isMobile =
        /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
      const isTablet =
        /tablet|ipad/i.test(ua) ||
        (ua.includes("android") && !ua.includes("mobile"));
      const isDesktop = !isMobile && !isTablet;

      let device = { type: "Unknown", brand: "Unknown", model: "Unknown" };

      if (isDesktop) {
        device.type = "Desktop";
      } else if (isTablet) {
        device.type = "Tablet";
        if (ua.includes("ipad")) {
          device.brand = "Apple";
          device.model = "iPad";
        } else if (ua.includes("android")) {
          device.brand = "Android";
        }
      } else if (isMobile) {
        device.type = "Mobile";
        if (ua.includes("iphone")) {
          device.brand = "Apple";
          device.model = "iPhone";
        } else if (ua.includes("pixel")) {
          device.brand = "Google";
          device.model = "Pixel";
        } else if (ua.includes("samsung")) {
          device.brand = "Samsung";
        } else if (ua.includes("android")) {
          device.brand = "Android";
        }
      }

      setParsedInfo({
        browser,
        os,
        device,
        isMobile,
        isTablet,
        isDesktop,
      });
    } catch (error) {
      console.error("Error parsing user agent:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User-Agent Parser</CardTitle>
        <CardDescription>Parse and analyze user-agent strings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>User-Agent String</Label>
          <Textarea
            value={userAgent}
            onChange={(e) => setUserAgent(e.target.value)}
            placeholder="Enter a user-agent string or leave empty to use your current browser's"
            className="min-h-[80px] font-mono text-sm"
          />
        </div>

        <Button onClick={parseUserAgent} className="w-full">
          Parse User-Agent
        </Button>

        {parsedInfo && (
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Browser</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Name:</div>
                <div>{parsedInfo.browser.name}</div>
                <div className="font-medium">Version:</div>
                <div>{parsedInfo.browser.version || "Unknown"}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Operating System</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Name:</div>
                <div>{parsedInfo.os.name}</div>
                <div className="font-medium">Version:</div>
                <div>{parsedInfo.os.version || "Unknown"}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Device</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Type:</div>
                <div>{parsedInfo.device.type}</div>
                <div className="font-medium">Brand:</div>
                <div>{parsedInfo.device.brand}</div>
                <div className="font-medium">Model:</div>
                <div>{parsedInfo.device.model}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Device Type</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Mobile:</div>
                <div>{parsedInfo.isMobile ? "Yes" : "No"}</div>
                <div className="font-medium">Tablet:</div>
                <div>{parsedInfo.isTablet ? "Yes" : "No"}</div>
                <div className="font-medium">Desktop:</div>
                <div>{parsedInfo.isDesktop ? "Yes" : "No"}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function HeaderViewer() {
  const [url, setUrl] = useState("https://httpbin.org/headers");
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchHeaders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(url);

      // For httpbin.org/headers, the response contains the headers in the body
      if (url.includes("httpbin.org/headers")) {
        const data = await response.json();
        setHeaders(data.headers);
      } else {
        // For other URLs, we can only see response headers
        const responseHeaders: Record<string, string> = {};
        response.headers.forEach((value, key) => {
          responseHeaders[key] = value;
        });
        setHeaders(responseHeaders);
      }
    } catch (error) {
      setError(
        `Error fetching headers: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      setHeaders({});
    } finally {
      setLoading(false);
    }
  };

  // Fetch headers on initial load
  useEffect(() => {
    fetchHeaders();
  }, []);

  const copyToClipboard = () => {
    const headerText = Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    navigator.clipboard.writeText(headerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Header Viewer</CardTitle>
        <CardDescription>View HTTP headers from requests</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to check headers"
            className="flex-1"
          />
          <Button onClick={fetchHeaders} disabled={loading}>
            {loading ? "Loading..." : "Fetch"}
          </Button>
        </div>

        {error && <div className="text-sm text-red-500 mt-2">{error}</div>}

        {Object.keys(headers).length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Response Headers</Label>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyToClipboard}
                className="h-8"
              >
                {copied ? (
                  <Check className="h-4 w-4 mr-1" />
                ) : (
                  <Copy className="h-4 w-4 mr-1" />
                )}
                {copied ? "Copied" : "Copy All"}
              </Button>
            </div>

            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2 font-medium">Header</th>
                    <th className="text-left p-2 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {Object.entries(headers).map(([key, value]) => (
                    <tr key={key} className="hover:bg-muted/50">
                      <td className="p-2 font-mono">{key}</td>
                      <td className="p-2 font-mono break-all">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              <p>
                Note: For security reasons, browsers can only see limited
                response headers. For complete header testing, try using the
                httpbin.org/headers endpoint or a server-side API.
              </p>
            </div>
          </div>
        )}

        {!loading && Object.keys(headers).length === 0 && !error && (
          <div className="text-center py-8 text-muted-foreground">
            No headers found. Try fetching from a different URL.
          </div>
        )}

        <div className="mt-4 space-y-2">
          <Label>Common Header Testing URLs</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUrl("https://httpbin.org/headers");
                fetchHeaders();
              }}
            >
              httpbin.org/headers
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUrl(
                  "https://httpbin.org/response-headers?Content-Type=application/json&X-Custom-Header=test"
                );
                fetchHeaders();
              }}
            >
              Custom Response Headers
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
