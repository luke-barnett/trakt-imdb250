using System;
using System.Linq.Expressions;
using System.Reflection;
using System.Web;
using System.Web.Mvc;

namespace TraktIMDB250.Web.Infrastructure
{
	public static class HtmlHelperExtensions
	{
		public static string SiteVersion
		{
			get
			{
				return Assembly.GetAssembly(typeof(TraktIMDB250.Web.Global)).GetName().Version.ToString();
			}
		}

		public static MvcHtmlString IncludeVersionedJS(this HtmlHelper helper, string filename)
		{
			return MvcHtmlString.Create(string.Format("<script type=\"text/javascript\" src=\"{0}?build={1}\"></script>", filename, SiteVersion));
		}

		public static MvcHtmlString IncludeVersionedCSS(this HtmlHelper helper, string filename, string media = null)
		{
			if (!string.IsNullOrWhiteSpace(media))
			{
				return MvcHtmlString.Create(string.Format("<link rel=\"stylesheet\" type=\"text/css\" href=\"{0}?build={1}\" media=\"{2}\" />", filename, SiteVersion, media));
			}

			return MvcHtmlString.Create(string.Format("<link rel=\"stylesheet\" type=\"text/css\" href=\"{0}?build={1}\" />", filename, SiteVersion));
		}

		public static MvcHtmlString ValidationErrorFor<TModel, TProperty>(this HtmlHelper<TModel> htmlHelper, Expression<Func<TModel, TProperty>> expression, string error)
		{
			if (HasError(htmlHelper, ModelMetadata.FromLambdaExpression(expression, htmlHelper.ViewData), ExpressionHelper.GetExpressionText(expression)))
				return new MvcHtmlString(error);
			else
				return null;
		}

		public static MvcHtmlString MainMenuActionLink(this HtmlHelper helper, string text, string action, string controller, string area)
		{
			var isCurrentView =
				string.Equals((string)helper.ViewContext.RouteData.Values["action"], action, StringComparison.OrdinalIgnoreCase) &&
				string.Equals((string)helper.ViewContext.RouteData.Values["controller"], controller, StringComparison.OrdinalIgnoreCase) &&
				string.Equals((string)helper.ViewContext.RouteData.Values["area"], area, StringComparison.OrdinalIgnoreCase);

			var urlHelper = new UrlHelper(HttpContext.Current.Request.RequestContext);

			return MvcHtmlString.Create(
				string.Format(
				isCurrentView ?
					"<li class=\"active\"><a href=\"{0}\">{1}</a></li>" :
					"<li><a href=\"{0}\">{1}</a></li>",
				urlHelper.Action(action, controller, new { area }), text));
		}

		static bool HasError(this HtmlHelper htmlHelper, ModelMetadata modelMetadata, string expression)
		{
			var modelName = htmlHelper.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(expression);
			var formContext = htmlHelper.ViewContext.FormContext;
			if (formContext == null)
				return false;

			if (!htmlHelper.ViewData.ModelState.ContainsKey(modelName))
				return false;

			var modelState = htmlHelper.ViewData.ModelState[modelName];
			if (modelState == null)
				return false;

			var modelErrors = modelState.Errors;
			if (modelErrors == null)
				return false;

			return (modelErrors.Count > 0);
		}
	}
}
