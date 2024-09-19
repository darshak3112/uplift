import React, { useState } from "react";
import Image from "next/image";
import {
  Textarea,
  TextInput,
  Button,
  Label,
  Select,
  Card,
  Spinner,
} from "flowbite-react";
import { FaTicketAlt, FaExclamationCircle, FaPaperPlane } from "react-icons/fa";

export default function TicketGeneration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketData, setTicketData] = useState({
    issueType: "",
    title: "",
    description: "",
    priority: "",
    email: "",
  });

  const handleChange = (e) => {
    const value = e.target.type === "file" ? e.target.files[0] : e.target.value;
    setTicketData({ ...ticketData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission process
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Ticket Submitted Successfully!");
      // Reset form after submission
      setTicketData({
        issueType: "",
        title: "",
        description: "",
        priority: "",
        email: "",
      });
    }, 2000);
  };

  return (
    <section className="flex flex-wrap justify-center p-5 md:px-8 lg:px-14">
      {/* Form Section */}
      <div className="w-full p-4 md:w-[60%] lg:w-[60%]">
        <Card className="flex flex-col max-w-lg p-4 space-y-6 bg-white shadow-2xl rounded-3xl">
          <div className="flex items-center mb-6 space-x-4">
            <FaTicketAlt className="text-4xl text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">Submit a Ticket</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div>
              <Label htmlFor="issueType" value="Issue Type" />
              <Select
                id="issueType"
                name="issueType"
                value={ticketData.issueType}
                onChange={handleChange}
                required
              >
                <option value="">Select an issue type</option>
                <option value="technical">Technical Support</option>
                <option value="billing">Billing Inquiry</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="title" value="Ticket Title" />
              <TextInput
                id="title"
                name="title"
                value={ticketData.title}
                onChange={handleChange}
                placeholder="Brief summary of the issue"
                required
              />
            </div>

            <div>
              <Label htmlFor="description" value="Description" />
              <Textarea
                id="description"
                name="description"
                value={ticketData.description}
                onChange={handleChange}
                placeholder="Please provide detailed information about your issue"
                required
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="priority" value="Priority Level" />
              <Select
                id="priority"
                name="priority"
                value={ticketData.priority}
                onChange={handleChange}
                required
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="email" value="Your Email" />
              <TextInput
                id="email"
                name="email"
                type="email"
                value={ticketData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <FaExclamationCircle className="mr-2" />
                <span>All fields are required</span>
              </div>
              <Button type="submit" color={"blue"} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" light={true} />
                    <span className="ml-2">Submitting...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    <span>Submit Ticket</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Image Section */}
      <div className="flex items-center justify-center w-full md:w-[40%] lg:w-[40%]">
        <Image
          className="object-cover w-full h-auto"
          src="/images/CustomerSupport.png"
          alt="Customer Support"
          width={600}
          height={800}
        />
      </div>
    </section>
  );
}
