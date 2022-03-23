export class HelpMenuItem {
  title: string;
  type?: 'video' | 'text';
  resource?: string;
  children?: HelpMenuItem[];
}

// tslint:disable:max-line-length
export const helpMenuModel: HelpMenuItem =
  {title: 'root', children: [
      { title: 'How To', children: [
          {title: 'Overview', children: [
              {title: 'Odyssey Overview', type: 'video', resource: 'https://player.vimeo.com/video/413611805'},
              {title: 'Home Page Overview', type: 'video', resource: 'https://player.vimeo.com/video/407574213'},
              {title: 'Schedules Overview', type: 'video', resource: 'https://player.vimeo.com/video/409528858'},
              {title: 'Equipment Overview', type: 'video', resource: 'https://player.vimeo.com/video/409275949'},
              {title: 'Haulage Log Overview', type: 'video', resource: 'https://player.vimeo.com/video/421201865'}
            ]},
          {title: 'Schedules', children: [
              {title: 'How to use the route finder', type: 'video', resource: 'https://player.vimeo.com/video/409157240'},
              {title: 'How to search for trade routes', type: 'video', resource: 'https://player.vimeo.com/video/408907501'},
              {title: 'How to search transports', type: 'video', resource: 'https://player.vimeo.com/video/408907095'},
              {title: 'How to search voyages', type: 'video', resource: 'https://player.vimeo.com/video/408906818'},
              {title: 'How to view live schedules', type: 'video', resource: 'https://player.vimeo.com/video/408822305'},
              {title: 'How to view Upcoming Sailings', type: 'video', resource: 'https://player.vimeo.com/video/408805675'}
            ]},
          {title: 'Quote', children: [
              {title: 'Quotation Overview', type: 'video', resource: 'https://player.vimeo.com/video/404558103'},
              {title: 'How to create a Quote (Port to Port)', type: 'video', resource: 'https://player.vimeo.com/video/404559748'},
              {title: 'How to adjust the pricing', type: 'video', resource: 'https://player.vimeo.com/video/404562654'},
              {title: 'How to add Free Time to a quotation', type: 'video', resource: 'https://player.vimeo.com/video/409160253'},
              {title: 'How to create and send a Quote Confirmation', type: 'video', resource: 'https://player.vimeo.com/video/404562733'},
              {title: 'How to accept or decline a quotation (open proposal)', type: 'video', resource: 'https://player.vimeo.com/video/404563899'},
              {title: 'How to copy a quote line', type: 'video', resource: 'https://player.vimeo.com/video/407573538'},
              {title: 'How to add special equipment', type: 'video', resource: 'https://player.vimeo.com/video/407574619'},
              {title: 'How to add hazardous cargo', type: 'video', resource: 'https://player.vimeo.com/video/407575680'},
              {title: 'How to add door locations', type: 'video', resource: 'https://player.vimeo.com/video/407577955'}
            ]},
          {title: 'Service Contract', children: [
              {title: 'Service Contract Overview', type: 'video', resource: 'https://player.vimeo.com/video/404567446'},
              {title: 'How to create a Service Contract (Bypass Quotation)', type: 'video', resource: 'https://player.vimeo.com/video/404569592'},
              {title: 'How to adjust the pricing', type: 'video', resource: 'https://player.vimeo.com/video/404572325'},
              {title: 'How to add Free Time to a Service Contract', type: 'video', resource: 'https://player.vimeo.com/video/404579213'},
              {title: 'How to accept or decline a Service Contract', type: 'video', resource: 'https://player.vimeo.com/video/404573031'},
              {title: 'How to extend an expired Service Contract Line', type: 'video', resource: 'https://player.vimeo.com/video/404575389'}
            ]},
          {title: 'Booking', children: [
              {title: 'Booking Overview', type: 'video', resource: 'https://player.vimeo.com/video/404668574'},
              {title: 'How to create a Container Booking', type: 'video', resource: 'https://player.vimeo.com/video/404658981'},
              {title: 'How to use Booking Templates', type: 'video', resource: 'https://player.vimeo.com/video/404970727'},
              {title: 'How to link a Service Contract to a Booking', type: 'video', resource: 'https://player.vimeo.com/video/404971800'},
              {title: 'How to adjust the pricing on a booking', type: 'video', resource: 'https://player.vimeo.com/video/404975180'},
              {title: 'How to add hazardous cargo to a booking', type: 'video', resource: 'https://player.vimeo.com/video/404978616'},
              {title: 'How to accept or decline a Booking', type: 'video', resource: 'https://player.vimeo.com/video/404978751'},
              {title: 'How to create and send a Booking Confirmation', type: 'video', resource: 'https://player.vimeo.com/video/404973373'},
              {title: 'How to allocate export containers to a Booking', type: 'video', resource: 'https://player.vimeo.com/video/404978120'},
              {title: 'How to create a Release or Delivery Order', type: 'video', resource: 'https://player.vimeo.com/video/404973888'},
              {title: 'How to generate Booking Lists and Reports', type: 'video', resource: 'https://player.vimeo.com/video/404972481'},
              {title: 'How to manage Booking Exceptions', type: 'video', resource: 'https://player.vimeo.com/video/404978782'},
              {title: 'How to Add Pre/On-Carriage to a Booking', type: 'video', resource: 'https://player.vimeo.com/video/421198851'},
              {title: 'How to merge a Booking', type: 'video', resource: 'https://player.vimeo.com/video/421204723'},
              {title: 'How to split a Booking', type: 'video', resource: 'https://player.vimeo.com/video/421216194'},
              {title: 'How to split an Itinerary', type: 'video', resource: 'https://player.vimeo.com/video/421204642'}
            ]},
          {title: 'Equipment', children: [{title: 'How to enter and manage container events', type: 'video', resource: 'https://player.vimeo.com/video/408509931'},
              {title: 'How to track containers', type: 'video', resource: 'https://player.vimeo.com/video/409296352'}
            ]},
          {title: 'Documentation', children: [
              {title: 'How to search for a Shipping Instruction', type: 'video', resource: 'https://player.vimeo.com/video/405520185'},
              {title: 'How to manage BL Clauses', type: 'video', resource: 'https://player.vimeo.com/video/405552940'},
              {title: 'How to create a Cargo Manifest', type: 'video', resource: 'https://player.vimeo.com/video/404559748'},
              {title: 'How to manage manifest locks', type: 'video', resource: 'https://player.vimeo.com/video/405549447'},
              {title: 'How to create a SI and print a BL', type: 'video', resource: 'https://player.vimeo.com/video/405747213'},
              {title: 'How to print a document (BL, Waybill, ARN, CRO, etc)', type: 'video', resource: 'https://player.vimeo.com/video/405758277'},
              {title: 'How to finalise a SI', type: 'video', resource: 'https://player.vimeo.com/video/405798873'},
              {title: 'How to administer import cargo', type: 'video', resource: 'https://player.vimeo.com/video/405893237'},
              {title: 'How to search manifest correctors', type: 'video', resource: 'https://player.vimeo.com/video/405898384'},
              {title: 'How to search for Bills of Lading', type: 'video', resource: 'https://player.vimeo.com/video/405552059'},
              {title: 'How to review and add Solas VGM', type: 'video', resource: 'https://player.vimeo.com/video/405894595'},
              {title: 'How to manage SI data for customs EDI', type: 'video', resource: 'https://player.vimeo.com/video/405897967'}
            ]},
          {title: 'Finance', children: [
              {title: 'How to create an Invoice', type: 'video', resource: 'https://player.vimeo.com/video/405799759'},
              {title: 'How to print an Invoice', type: 'video', resource: 'https://player.vimeo.com/video/405799088'},
              {title: 'How to manage payments against an invoice', type: 'video', resource: 'https://player.vimeo.com/video/405844264'},
              {title: 'Finance Overview', type: 'video', resource: 'https://player.vimeo.com/video/409188625'},
              {title: 'How to view Disbursement Account Summary and Status', type: 'video', resource: 'https://player.vimeo.com/video/408352153'},
              {title: 'How to view and use a Disbursement Account Template', type: 'video', resource: 'https://player.vimeo.com/video/408353761'},
              {title: 'How to manage DA Formulas', type: 'video', resource: 'https://player.vimeo.com/video/408355166'},
              {title: 'How to create a Disbursement Account', type: 'video', resource: 'https://player.vimeo.com/video/408357622'},
              {title: 'How to create a Credit Note', type: 'video', resource: 'https://player.vimeo.com/video/405839966'}
            ]},
          {title: 'CRM', children: [
              {title: 'Account Overview', type: 'video', resource: 'https://player.vimeo.com/video/405389826'},
              {title: 'How to register a new Supplier', type: 'video', resource: 'https://player.vimeo.com/video/405397414'},
              {title: 'How to add an address to my local Address Book', type: 'video', resource: 'https://player.vimeo.com/video/405403329'},
              {title: 'How to register a new Customer Account', type: 'video', resource: 'https://player.vimeo.com/video/405392671'},
              {title: 'How to upload a list of Accounts', type: 'video', resource: 'https://player.vimeo.com/video/405397185'},
              {title: 'How to view the details of an Account', type: 'video', resource: 'https://player.vimeo.com/video/405394462'},
              {title: 'How to approve an Account', type: 'video', resource: 'https://player.vimeo.com/video/405392183'},
              {title: 'How to merge Accounts', type: 'video', resource: 'https://player.vimeo.com/video/405392180'},
              {title: 'How to manage Activity on an Account', type: 'video', resource: 'https://player.vimeo.com/video/405389319'},
              {title: 'How to manage Cases on an Account', type: 'video', resource: 'https://player.vimeo.com/video/405389169'},
              {title: 'How to upload a list of suppliers', type: 'video', resource: 'https://player.vimeo.com/video/405399146'},
              {title: 'How to view and edit a Supplier', type: 'video', resource: 'https://player.vimeo.com/video/405397824'},
              {title: 'How to upload a list of addresses', type: 'video', resource: 'https://player.vimeo.com/video/405405299'},
              {title: 'How to create an Account from an Address', type: 'video', resource: 'https://player.vimeo.com/video/405404660'},
              {title: 'How to find and edit an Address', type: 'video', resource: 'https://player.vimeo.com/video/405406331'},
              {title: 'How to view the statement of an account', type: 'video', resource: 'https://player.vimeo.com/video/405856556'}
            ]},
          {title: 'Miscellaneous', children: [
              {title: 'How to create a Partner Connection', type: 'video', resource: 'https://player.vimeo.com/video/419915739'}
            ]}
      ]},
          {title: 'Quick Tips', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/410929/Quick+Tips'},
          {title: 'Jabber', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/411058/Jabber'},
          {title: 'Schedules', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/411116/Schedules'},
          {title: 'Quotations', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/410792/Quotations'},
          {title: 'Service Contracts', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/410790/Service+Contracts'},
          {title: 'Bookings', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/411109/Bookings'},
          {title: 'Equipment', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/411111/Equipment'},
          {title: 'Documents', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/410932/Documents'},
          {title: 'VGM', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/411146/Verified+Gross+Mass+VGM+FAQs'},
          {title: 'Data', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/410931/Data'},
          {title: 'Finance', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/410934/Finance'},
          {title: 'CRM', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/410978/CRM'},
          {title: 'User Profile', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/410952/User+Profile'},
          {title: 'Manage Tasks', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/410953/Manage+Tasks'},
          {title: 'Admin', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/410927/Admin'},
          {title: 'Frequently Asked Questions', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/410930/Frequently+Asked+Questions'},
          {title: 'Release Notes', type: 'text', resource: 'https://locussoftware.atlassian.net/wiki/spaces/ODYDOC/pages/410921/Release+Notes'}
  ]}
;
