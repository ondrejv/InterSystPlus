using System;
using System.Web;
using System.Web.UI;
using System.Text;
using System.IO;

using CMS.PortalControls;
using CMS.PortalEngine;
using CMS.OutputFilter;
using CMS.Helpers;

public partial class KenticoCom_WebParts_DirectRenderer : CMSAbstractWebPart
{
    #region "Properties"

    /// <summary>
    /// Gets or sets the control ID of the parent control.
    /// Control which should be rendered is searched among childs of this parent control.
    /// </summary>
    public string StartingParentControlID
    {
        get
        {
            return ValidationHelper.GetString(GetValue("StartingParentControlID"), null);
        }
        set
        {
            SetValue("StartingParentControlID", value);
        }
    }


    /// <summary>
    /// Gets or sets ID of the control which should be rendered.
    /// </summary>
    public string RenderedControlID
    {
        get
        {
            return ValidationHelper.GetString(GetValue("RenderedControlID"), null);
        }
        set
        {
            SetValue("RenderedControlID", value);
        }
    }


    /// <summary>
    /// Gets or sets ID of the control which should be rendered.
    /// </summary>
    public bool OnlyOnLiveSite
    {
        get
        {
            return ValidationHelper.GetBoolean(GetValue("OnlyOnLiveSite"), false);
        }
        set
        {
            SetValue("OnlyOnLiveSite", value);
        }
    }


    /// <summary>
    /// If enabled, output of the rendered control is saved to the full page cache, if enabled on page properties.
    /// </summary>
    public bool UseFullPageCache
    {
        get
        {
            return ValidationHelper.GetBoolean(GetValue("UseFullPageCache"), false);
        }
        set
        {
            SetValue("UseFullPageCache", value);
        }
    }

    #endregion


    #region "Methods"

    /// <summary>
    /// Content loaded event handler
    /// </summary>
    public override void OnContentLoaded()
    {
        base.OnContentLoaded();
        SetupControl();
    }


    /// <summary>
    /// Initializes the control properties
    /// </summary>
    public void SetupControl()
    {
        if (this.StopProcessing)
        {
            // Do nothing
        }
        else
        {
            bool render = false;

            // Allow only in this modes
            if ((PortalContext.ViewMode == ViewModeEnum.LiveSite) || (PortalContext.ViewMode == ViewModeEnum.Preview) || (PortalContext.ViewMode == ViewModeEnum.Edit))
            {
                render = (!this.OnlyOnLiveSite || (PortalContext.ViewMode == ViewModeEnum.LiveSite));
            }

            if (render)
            {
                // Hook up to PreRenderComplete event
                this.Page.PreRenderComplete += new EventHandler(Page_PreRenderComplete);
            }
        }
    }


    /// <summary>
    /// After PreRender is complete, specified control may be directly rendered and send to response
    /// </summary>
    protected void Page_PreRenderComplete(object sender, EventArgs e)
    {
        Control startingControl = null;

        // Find parent or setup page as starting control
        if (!String.IsNullOrEmpty(this.StartingParentControlID))
        {
            startingControl = FindParentControl(this, this.StartingParentControlID);
        }
        else
        {
            startingControl = this.Page;
        }

        if (startingControl != null)
        {
            // Find control which should be rendered
            Control renderedControl = startingControl.FindControl(this.RenderedControlID);

            if (renderedControl != null)
            {
                StringBuilder sb = new StringBuilder();
                StringWriter sw = new StringWriter(sb);
                Html32TextWriter mwriter = new Html32TextWriter(sw);
                renderedControl.RenderControl(mwriter);

                string finalHtml = sb.ToString();

                if (this.UseFullPageCache)
                {
                    OutputData output = new OutputData(finalHtml, RequestContext.UseGZip, GetResponseEncoding());

                    // Save the data to cache
                    ResponseOutputFilter.SaveOutputToCache(output);
                }

                // Write rendered control directly to output
                Response.Clear();
                Response.Write(finalHtml);
                RequestHelper.EndResponse();
            }
        }
    }


    /// <summary>
    /// Traverses controls tree upwards from this control and searches for control with specified control ID.    
    /// </summary>
    /// <param name="control">Starting control</param>
    /// <param name="controlId">Searched control id</param>
    /// <returns>Returns such control or null if not found.</returns>
    private Control FindParentControl(Control control, string controlId)
    {
        if (control == null)
        {
            return null;
        }
        if (control.ID == controlId)
        {
            return control;
        }

        return FindParentControl(control.Parent, controlId);
    }


    /// <summary>
    /// Gets the encoding for current request - taken from OutputFilter class
    /// </summary>
    private static Encoding GetResponseEncoding()
    {
        Encoding result = ResponseOutputFilter.OutputEncoding;

        // Get charset from current response
        string charset = HttpContext.Current.Response.Charset;
        if (string.IsNullOrEmpty(charset))
        {
            return result;
        }
        try
        {
            result = Encoding.GetEncoding(charset);
        }
        catch
        {
        }

        return result;
    }

    #endregion
}
